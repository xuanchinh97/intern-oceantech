import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Paper, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { toast } from 'react-toastify';
import { getCommune, getDistrict, getProvince, saveEmployee, updateEmployee } from './EmployeeService';


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

  const { t, handleClose, open, item } = props

  const initEmployee = {
    id: item.id,
    name: item.name || "",
    code: item.code || "",
    phone: item.phone || "",
    email: item.email || "",
    age: item.age || "",
    commune: {},
    district: {},
    province: {},
  }

  const [employee, setEmployee] = useState(initEmployee)
  const [communeList, setCommuneList] = useState([])
  const [districtList, setDistrictList] = useState([])
  const [provinceList, setProvinceList] = useState([])


  const handleChange = (e) => {
    let value = e.target.value
    let name = e.target.name
    setEmployee(prevEmployee => ({
      ...prevEmployee,
      [name]: value,
    }))
  }

  const handleFormSubmit = () => {
    if (employee.id) {
      updateEmployee(employee)
        .then(({ data }) => {
          if (data.code === 200) {
            toast.success(t("staff.noti.updateSuccess"));
            handleClose();
          } else {
            toast.error(data.message);
          }
        })
    } else {
      saveEmployee(employee)
        .then(({ data }) => {
          if (data.code === 200) {
            toast.success(t("staff.noti.addSuccess"));
            handleClose();
          } else {
            toast.error(data.message);
          }
        })
    }
  }

  const getDistrictCommuneProvince = () => {
    getDistrict()
      .then(({ data }) => setDistrictList([...data.data]))
      .catch(err => console.log(err))
    getCommune()
      .then(({ data }) => setCommuneList([...data.data]))
      .catch(err => console.log(err))
    getProvince()
      .then(({ data }) => setProvinceList([...data.data]))
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
      <DialogTitle
        style={{ cursor: "move", paddingBottom: "0px" }}
        id="draggable-dialog-title"
      >
        <h4 className="">{employee.id ? t("general.update") : t("ReceivingAsset.addNew")}</h4>
      </DialogTitle>

      <ValidatorForm onSubmit={handleFormSubmit}>
        <DialogContent>
          <Grid className="container" spacing={2}>

            <Grid item sm={12} xs={12}>
              <TextValidator className="w-100 "
                label={
                  <span>
                    {t("staff.code")}
                  </span>
                }
                required
                onChange={handleChange}
                type="text"
                name="code"
                value={employee.code}
                inputProps={{ maxLength: 10 }}
                validators={["matchRegexp:([a-zA-Z0-9]{6,10})$"]}
                errorMessages={[t("staff.required.code")]}
              />
            </Grid>

            <Grid item sm={12} xs={12}>
              <TextValidator className="w-100 "
                label={
                  <span>
                    {t("staff.name")}
                  </span>
                }
                required
                onChange={handleChange}
                type="text"
                name="name"
                value={employee.name}
                inputProps={{ maxLength: 25 }}
                validators={['matchRegexp:([a-zA-Z])$']}
                errorMessages={[t("staff.required.name")]}
              />
            </Grid>

            <Grid item sm={12} xs={12}>
              <TextValidator className="w-100 "
                label={
                  <span>
                    {t("staff.age")}
                  </span>
                }
                required
                onChange={handleChange}
                type="text"
                name="age"
                value={employee.age}
                validators={['matchRegexp:(^[0-9]{1,2})$']}
                errorMessages={[t("staff.required.age")]}
              />
            </Grid>

            <Grid item sm={12} xs={12}>
              <TextValidator className="w-100 "
                label={
                  <span>
                    {t("staff.phone")}
                  </span>
                }
                required
                onChange={handleChange}
                type="number"
                name="phone"
                value={employee.phone}
                validators={['matchRegexp:(^[0-9]{10})$']}
                errorMessages={[t("staff.required.phone")]}
              />
            </Grid>

            <Grid item sm={12} xs={12}>
              <TextValidator className="w-100 "
                label={
                  <span>
                    {t("staff.email")}
                  </span>
                }
                required
                onChange={handleChange}
                type="email"
                name="email"
                value={employee.email}
                validators={['isEmail']}
                errorMessages={[t("staff.required.email")]}
              />
            </Grid>

            <Grid item sm={12} xs={12}>
              <TextField
                required
                select
                name="province"
                label="Tỉnh"
                value={employee.province}
                onChange={handleChange}
                helperText="Please select your province"
              >
                {provinceList && provinceList.map((province) => (
                  <MenuItem key={province.id} value={province}>
                    {province.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item sm={12} xs={12}>
              <TextField
                required
                select
                name="district"
                label="Huyện"
                value={employee.district}
                onChange={handleChange}
                helperText="Please select your district"
              >
                {districtList && districtList.map((district) => (
                  <MenuItem key={district.id} value={district}>
                    {district.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item sm={12} xs={12}>
              <TextField
                required
                select
                label="Xã"
                name="commune"
                value={employee.commune}
                onChange={handleChange}
                helperText="Please select your commune"
              >
                {communeList && communeList.map((commune) => (
                  <MenuItem key={commune.id} value={commune}>
                    {commune.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions>
          <div className="flex flex-space-between flex-middle mt-12">
            <Button
              variant="contained"
              className="mr-12"
              color="secondary"
              onClick={() => handleClose()}
            >
              {t("general.cancel")}
            </Button>
            <Button
              variant="contained"
              style={{ marginRight: "15px" }}
              color="primary"
              type="submit"
            >
              {t("general.save")}
            </Button>
          </div>
        </DialogActions>
        
      </ValidatorForm>
    </Dialog>
  )
}

export default EmployeeDialog
