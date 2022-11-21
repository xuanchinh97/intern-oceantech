import { Button, Grid, Icon, IconButton, Tooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { Breadcrumb, ConfirmationDialog } from 'egret'
import MaterialTable, { MTableToolbar } from 'material-table'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { deleteEmployeeAction, searchEmployeeAction } from '../../redux/actions/EmployeeActions'
import EmployeeDialog from './EmployeeDialog'

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

  return (
    <div className='none_wrap'>
      <LightTooltip>
        <IconButton
          size="small"
          onClick={() => onSelect(item, 0)}
        >
          <Icon color="primary">edit</Icon>
        </IconButton>
      </LightTooltip>

      <LightTooltip>
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

function Employee() {

  const [id, setId] = useState("")
  const [item, setItem] = useState({})
  const [shouldEditor, setShouldEditor] = useState(false)
  const [shouldDelete, setShouldDelete] = useState(false)

  const dispatch = useDispatch();

  const employeeList = useSelector(state => state.employee.employeeList)
  const response = useSelector(state => state.employee.response)

  useEffect(() => {
    dispatch(searchEmployeeAction())
  }, [])

  const handleDialogClose = () => {
    setShouldDelete(false)
    setShouldEditor(false)
  }

  const handleAddButtonClick = (item) => {
    setItem(item)
    setShouldEditor(true)
  }

  const handleDeleteIconClick = (id) => {
    setId(id)
    setShouldDelete(true)
  }

  const handleDeleteItem = () => {
    dispatch(deleteEmployeeAction(id))
    handleDialogClose()
  }

  let TitlePage = "Quản lý nhân viên";

  let columns = [
    { title: "Mã nhân viên", field: "code", width: "150" },
    {
      title: "Tên nhân viên", field: "name",
      cellStyle: { minWidth: 150, maxWidth: '100%' }
    },
    { title: "Tuổi", field: "age", width: "150" },
    { title: "Điện thoại", field: "phone", width: "150" },
    { title: "Email", field: "email", width: "150" },
    {
      title: "Thao tác",
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
          { name: "Quản lý", path: "/directory/apartment" },
          { name: "Quản lý nhân viên" }
        ]}
        />
      </div>

      <Grid container spacing={2} justify="space-between">
        <Grid item md={3} xs={12}>
          <Button
            className="align-bottom mr-16"
            variant="contained"
            color="primary"
            onClick={() => handleAddButtonClick(null)}
          >
            Thêm mới
          </Button>
        </Grid>

        <Grid item xs={12}>
          <div>
            {shouldEditor && (
              <EmployeeDialog
                handleClose={handleDialogClose}
                open={shouldEditor}
                item={item}
                response={response}
              />
            )}

            {shouldDelete && (
              <ConfirmationDialog
                title="Xác nhận"
                open={shouldDelete}
                onConfirmDialogClose={handleDialogClose}
                onYesClick={handleDeleteItem}
                text="Bạn chắc chắn muốn xóa"
                Yes="Yes"
                No="No"
              />
            )}
          </div>

          <MaterialTable
            title="Nhân viên"
            data={employeeList}
            columns={columns}
            localization={{
              body: {
                emptyDataSourceMessage: "Không có bản ghi nào",
              },
            }}
            options={{
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
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default Employee