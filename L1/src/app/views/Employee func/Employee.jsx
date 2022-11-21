import { Button, Grid, Icon, IconButton, Tooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { Breadcrumb, ConfirmationDialog } from 'egret'
import MaterialTable, { MTableToolbar } from 'material-table'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import EmployeeDialog from './EmployeeDialog'
import { deleteEmployee, searchEmployee } from './EmployeeService'

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3
})

const LightTooltip = withStyles((theme) => ({
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

const MaterialButton = ({ item, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className='none_wrap'>
      <LightTooltip
        title={t("general.editIcon")}
        placement="right-end"
        enterDelay={300}
        leaveDelay={200}
      >
        <IconButton
          size="small"
          onClick={() => onSelect(item, 0)}
        >
          <Icon color="primary">edit</Icon>
        </IconButton>
      </LightTooltip>

      <LightTooltip
        title={t("general.delete")}
        placement="right-end"
        enterDelay={300}
        leaveDelay={200}
      >
        <IconButton
          size="small"
          onClick={() => onSelect(item, 1)}
        >
          <Icon color="error">delete</Icon>
        </IconButton>
      </LightTooltip>
    </div>
  )
}
let n = 0

function Employee() {
  console.log("re-render", n++);

  const [id, setId] = useState("")
  const [item, setItem] = useState({})
  const [itemList, setItemList] = useState([])
  const [itemListDelete, setItemListDelete] = useState([])
  const [shouldEditor, setShouldEditor] = useState(false)
  const [shouldDelete, setShouldDelete] = useState(false)
  const [shouldDeleteAll, setShouldDeleteAll] = useState(false)

  const { t } = useTranslation();

  useEffect(() => {
    updateData()
  }, [])

  const updateData = () => {
    let searchObject = {}
    searchEmployee(searchObject)
      .then(({ data }) => {
        setItemList([...data.data])
      })
      .catch(err => console.log(err))
  }

  const handleDialogClose = () => {
    setShouldDeleteAll(false)
    setShouldDelete(false)
    setShouldEditor(false)
    updateData()
  }

  const handleAddButtonClick = (item) => {
    setItem(item)
    setShouldEditor(true)
  }

  const handleDeleteButtonClick = () => {
    if (!itemListDelete || itemListDelete.length === 0) {
      toast.warning(t('general.noti_check_data'))
    } else {
      setShouldDeleteAll(true)
    }
  }

  const handleDeleteAll = () => {

    for (let i = 0; i < itemListDelete.length; i++) {
      deleteEmployee(itemListDelete[i].id)
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

    setItemListDelete([])
    handleDialogClose()
  }

  const handleDeleteIconClick = (id) => {
    setId(id)
    setShouldDelete(true)
  }

  const handleDeleteItem = () => {
    deleteEmployee(id)
      .then(() => {
        updateData()
        handleDialogClose()
        toast.success(t('staff.noti.deleteSuccess'))
      })
      .catch((err) => {
        console.log(err)
        toast.error(t('staff.noti.used'))
      })
  }

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
              setItem(rowData)
              setShouldEditor(true)
            } else if (method === 1) {
              handleDeleteIconClick(rowData.id);
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
            onClick={() => handleAddButtonClick({})}
          >
            {t("general.add")}
          </Button>
          <Button
            className="align-bottom mr-16 mb-16"
            variant="contained"
            color="primary"
            onClick={handleDeleteButtonClick}
          >
            {t("general.delete")}
          </Button>

          {shouldDeleteAll && (
            <ConfirmationDialog
              open={shouldDeleteAll}
              onConfirmDialogClose={handleDialogClose}
              onYesClick={handleDeleteAll}
              title={t("confirm")}
              text={t("DeleteAllConfirm")}
              Yes={t("general.yes")}
              No={t("general.no")}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <div>
            {shouldEditor && (
              <EmployeeDialog
                t={t}
                handleClose={handleDialogClose}
                open={shouldEditor}
                item={item}
              />
            )}

            {shouldDelete && (
              <ConfirmationDialog
                title={t('general.confirm')}
                open={shouldDelete}
                onConfirmDialogClose={handleDialogClose}
                onYesClick={handleDeleteItem}
                text={t('DeleteConfirm')}
                Yes={t('general.yes')}
                No={t('general.no')}
              />
            )}
          </div>

          <MaterialTable
            title={t("staff.title")}
            data={itemList}
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
              setItemListDelete([...rows])
            }}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default Employee