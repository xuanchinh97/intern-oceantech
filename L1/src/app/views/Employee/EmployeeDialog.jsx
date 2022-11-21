import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Icon, IconButton, MenuItem, Paper } from '@material-ui/core';
import { saveEmployeeAction, updateEmployeeAction } from 'app/redux/actions/EmployeeActions';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import '../../../styles/views/_style.scss';
import { getCommune, getDistrict, getProvince } from './EmployeeService';


toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  )
}

function EmployeeDialog(props) {

  const { handleClose, open, item, response } = props

  const [employee, setEmployee] = useState(() => item === null ? {} : item)
  const [provinceList, setProvinceList] = useState([])
  const [districtList, setDistrictList] = useState([])
  const [communeList, setCommuneList] = useState([])
  const [communeListFilter, setCommuneListFilter] = useState([])

  const dispatch = useDispatch();

  if (response.code === 200) {
    handleClose()
  }

  const handleChange = (e) => {
    let value = e.target.value
    let name = e.target.name
    setEmployee({ ...employee, [name]: value, })
  }

  const getCommuneByDistrict = (e) => {
    let districtId = e.target.value.id
    let communeListNew = communeList.filter(commune => commune.district.id === districtId)
    setCommuneListFilter(communeListNew)
    handleChange(e)
  }

  const handleFormSubmit = () => {
    if (employee.id) {
      dispatch(updateEmployeeAction(employee))
    } else {
      dispatch(saveEmployeeAction(employee))
    }
  }

  const getDistrictCommuneProvince = () => {
    getProvince()
      .then(({ data }) => setProvinceList([...data.data]))
      .catch(err => console.log(err))
    getDistrict()
      .then(({ data }) => setDistrictList([...data.data]))
      .catch(err => console.log(err))
    getCommune()
      .then(({ data }) => setCommuneList([...data.data]))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getDistrictCommuneProvince()
  }, [])

  return (
    <Dialog
      open={open}
      PaperComponent={PaperComponent}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        <span className="mb-20 styleColor"> {(employee.id ? "Cập nhật" : "Thêm mới") + " Nhân viên"} </span>
        <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}>
          <Icon color="error" title="close">close</Icon>
        </IconButton>
      </DialogTitle>

      <ValidatorForm onSubmit={handleFormSubmit}>
        <DialogContent dividers >
          <Grid className="mb-16" container spacing={1}>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextValidator className="w-100 mb-16"
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>Mã nhân viên
                  </span>
                }
                onChange={handleChange}
                type="text"
                name="code"
                value={employee.code}
                inputProps={{ maxLength: 10 }}
                validators={["required", "matchRegexp:([a-zA-Z0-9]{6,10})$"]}
                errorMessages={["Trường này là bắt buộc", "mã nhân viên từ 6-10 kí tự không chứa ký tự đặc biệt"]}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextValidator className="w-100 mb-16"
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>Tên nhân viên
                  </span>
                }
                onChange={handleChange}
                type="text"
                name="name"
                value={employee.name}
                inputProps={{ maxLength: 25 }}
                validators={["required", 'matchRegexp:([a-zA-Z])$']}
                errorMessages={["Trường này là bắt buộc", "tên không chứa số và ký tự đặc biệt"]}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextValidator className="w-100 mb-16"
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>Tuổi
                  </span>
                }
                onChange={handleChange}
                type="text"
                name="age"
                value={employee.age}
                validators={["required", 'matchRegexp:(^[0-9]{1,2})$']}
                errorMessages={["Trường này là bắt buộc", "tuổi tối đa 2 chữ số"]}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextValidator className="w-100 mb-16"
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>Điện thoại
                  </span>
                }
                onChange={handleChange}
                type="text"
                name="phone"
                value={employee.phone}
                validators={["required", 'matchRegexp:(^[0-9]{10})$']}
                errorMessages={["Trường này là bắt buộc", "số điện thoại gồm 10 chữ số"]}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextValidator className="w-100 mb-16"
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>Email
                  </span>
                }
                onChange={handleChange}
                type="email"
                name="email"
                value={employee.email}
                validators={["required", 'isEmail']}
                errorMessages={["Trường này là bắt buộc", "email chưa đúng định dạng"]}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={12}>
              <TextValidator
                className="w-100 mb-16"
                select
                name="province"
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>Tỉnh
                  </span>
                }
                value={employee.province}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Trường này là bắt buộc"]}
                variant="outlined"
                size="small"
              >
                {provinceList && provinceList.map((province) => (
                  <MenuItem key={province.id} value={province}>
                    {province.name}
                  </MenuItem>
                ))}
              </TextValidator>
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={12}>
              <TextValidator
                className="w-100 mb-16"
                select
                name="district"
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>Huyện
                  </span>
                }
                value={employee.district}
                onChange={getCommuneByDistrict}
                validators={["required"]}
                errorMessages={["Trường này là bắt buộc"]}
                variant="outlined"
                size="small"
              >
                {districtList && districtList.map((district) => (
                  <MenuItem key={district.id} value={district}>
                    {district.name}
                  </MenuItem>
                ))}
              </TextValidator>
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={12}>
              <TextValidator
                className="w-100 mb-16"
                select
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>Xã
                  </span>
                }
                name="commune"
                value={employee.commune}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Trường này là bắt buộc"]}
                variant="outlined"
                size="small"
              >
                {communeListFilter && communeListFilter.map((commune) => (
                  <MenuItem key={commune.id} value={commune}>
                    {commune.name}
                  </MenuItem>
                ))}
              </TextValidator>
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions spacing={4} className="flex flex-end flex-middle mt-12">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Save
          </Button>
        </DialogActions>

      </ValidatorForm>
    </Dialog>
  )
}

export default EmployeeDialog
