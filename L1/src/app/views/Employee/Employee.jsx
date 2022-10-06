import { Icon, Grid, IconButton, Button, Tooltip } from '@material-ui/core';
import { Breadcrumb, ConfirmationDialog } from 'egret';
import MaterialTable, { MTableToolbar } from 'material-table';
import { withStyles } from "@material-ui/core/styles";
import React from 'react'
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import EmployeeDialog from './EmployeeDialog';
import { deleteEmployee, searchEmployee } from './EmployeeService';


toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3
})

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0,0,0,0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    position: "absolute",
    top: "-15px",
    left: "-30px",
    width: "80px"
  }
}))(Tooltip)

function MaterialButton({ item, onSelect }) {
  const { t } = useTranslation();

  return (
    <div className='none_wrap'>
      <LightTooltip
        title={t("general.editIcon")}
        placement="right-end"
        enterDelay={300}
        leaveDelay={200}
      >
        <IconButton size="small" onClick={() => onSelect(item, 0)}>
          <Icon fontSize="small" color="primary">edit</Icon>
        </IconButton>
      </LightTooltip>

      <LightTooltip
        title={t("general.delete")}
        placement="right-end"
        enterDelay={300}
        leaveDelay={200}
      >
        <IconButton size="small" onClick={() => onSelect(item, 1)}>
          <Icon fontSize="small" color="error">delete</Icon>
        </IconButton>
      </LightTooltip>
    </div>
  )
}

class Employee extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: "",
      item: {},
      itemList: [],
      shouldOpenEditorDialog: false,
      shouldOpenDeleteDialog: false,
      shouldOpenDeleteAllDialog: false,
    }
  }

  componentDidMount() {
    this.updateData()
  }

  updateData = () => {
    var searchObject = {}
    searchEmployee(searchObject)
      .then(({ data }) => {
        this.setState({ itemList: [...data.data] })
      })
      .catch(err => console.log(err))
  }

  handleDialogClose = () => {
    this.setState({
      shouldOpenDeleteAllDialog: false,
      shouldOpenDeleteDialog: false,
      shouldOpenEditorDialog: false,
    },
      () => {
        this.updateData()
      }
    )
  }

  handleAddButtonClick = (item) => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true
    }
    )
  }

  handleDeleteIconClick = (id) => {
    this.setState({
      id,
      shouldOpenDeleteDialog: true
    })
  }

  handleDeleteItem = () => {
    let { t } = this.props
    deleteEmployee(this.state.id)
      .then(() => {
        this.updateData()
        this.handleDialogClose()
        toast.success(t('staff.noti.deleteSuccess'))
      })
      .catch((err) => {
        console.log(err)
        toast.error(t('staff.noti.used'))
      })
  }

  handleDeleteButtonClick = () => {
    let { t } = this.props
    if (!this.data || this.data.length === 0) {
      toast.warning(t('general.noti_check_data'))
    } else {
      this.setState({
        shouldOpenDeleteAllDialog: true
      })
    }
  }

  handleDeleteAll = () => {
    let { t } = this.props
    let list = this.data

    for (let i = 0; i < list.length; i++) {
      deleteEmployee(list[i].id)
        .then((res) => {
          if (res && res.data.code === 200) {
            toast.success(t("DeleteSuccess"));
          } else {
            toast.error(res.data.message);
          }
        })
        .catch(err => {
          toast.error(t('staff.noti.used'))
          console.log(err)
        })
    }

    this.handleDialogClose()
    this.data = null
  }

  render() {
    const { t, i18n } = this.props;
    let TitlePage = t("staff.title");

    let columns = [
      {
        title: t("general.index"), field: "tableData.id", width: "50",
        headerStyle: { padding: "0px" }, cellStyle: { padding: "0px" }
      },
      { title: t("staff.code"), field: "code", width: "150" },
      {
        title: t("staff.name"), field: "name",
        cellStyle: { minWidth: 150, maxWidth: '100%' }
      },
      { title: t("staff.age"), field: "age", width: "150" },
      { title: t("staff.phone"), field: "phone", width: "150" },
      { title: t("staff.email"), field: "email", width: "150" },
      {
        title: t("general.action"),
        field: "custom",
        align: "left",
        width: "120",
        headerStyle: {
          padding: "0px",
        },
        cellStyle: {
          padding: "0px",
        },
        render: (rowData) => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 0) {
                this.setState({
                  item: rowData,
                  shouldOpenEditorDialog: true,
                })
              } else if (method === 1) {
                this.handleDeleteIconClick(rowData.id);
              }
            }}
          />
        ),
      },
    ];


    return (
      <div className='m-sm-30'>
        <Helmet>
          <title>{TitlePage} </title>
        </Helmet>

        <div className='mb-sm-30'>
          <Breadcrumb routeSegments={[
            { name: t("Dashboard.manage"), path: "/directory/apartment" },
            { name: t("staff.title") }
          ]}
          />
        </div>

        <Grid container spacing={2} justify="space-between">
          <Grid item md={3} xs={12}>
            <Button
              className="align-bottom mr-16 mb-16"
              variant="contained"
              color="primary"
              onClick={() => this.handleAddButtonClick(null)}
            >
              {t("general.add")}
            </Button>
            <Button
              className="align-bottom mr-16 mb-16"
              variant="contained"
              color="primary"
              onClick={this.handleDeleteButtonClick}
            >
              {t("general.delete")}
            </Button>

            {this.state.shouldOpenDeleteAllDialog && (
              <ConfirmationDialog
                open={this.state.shouldOpenDeleteAllDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleDeleteAll}
                title={t("confirm")}
                text={t("DeleteAllConfirm")}
                Yes={t("general.yes")}
                No={t("general.no")}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <div>
              {this.state.shouldOpenEditorDialog && (
                <EmployeeDialog
                  t={t}
                  i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenEditorDialog}
                  item={this.state.item}
                />
              )}

              {this.state.shouldOpenDeleteDialog && (
                <ConfirmationDialog
                  title={t('general.confirm')}
                  open={this.state.shouldOpenDeleteDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleDeleteItem}
                  text={t('DeleteConfirm')}
                  Yes={t('general.yes')}
                  No={t('general.no')}
                />
              )}
            </div>

            <MaterialTable
              title={t("staff.title")}
              data={this.state.itemList}
              columns={columns}
              localization={{
                body: {
                  emptyDataSourceMessage: `${t(
                    "general.emptyDataMessageTable"
                  )}`,
                },
                toolbar: {
                  nRowsSelected: `${t("general.selects")}`,
                },
              }}
              options={{
                selection: true,
                actionsColumnIndex: -1,
                paging: true,
                pageSize: 10,
                pageSizeOptions: [3, 5, 10, 20],
                padding: "dense",
                search: true,
                toolbar: true,
                maxBodyHeight: "1000px",
                minBodyHeight: "370px",
                exportButton: {
                  csv: true,
                  pdf: true,
                },
                rowStyle: (rowData) => ({
                  backgroundColor:
                    rowData.tableData.id % 2 === 1 ? "#EEE" : "#FFF",
                }),
                headerStyle: {
                  backgroundColor: "#358600",
                  color: "#fff",
                },
              }}
              components={{
                Toolbar: (props) => <MTableToolbar {...props} />,
              }}
              onSelectionChange={(rows) => {
                this.data = rows;
              }}
            />

          </Grid>
        </Grid>
      </div>
    )
  }

}


export default Employee;