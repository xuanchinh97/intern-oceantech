import React, { Component } from "react";
import {
  Dialog, Button, Grid, DialogActions, Paper, DialogTitle, DialogContent, MenuItem, TextField,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Draggable from "react-draggable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  saveEmployee,
  updateEmployee,
  getCommune,
  getProvince,
  getDistrict,
} from "./EmployeeService";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

class EmployeeDialog extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    let { item } = this.props;
    this.state = {
      ...item,
      listCommune: [],
      listDistrict: [],
      listProvince: [],
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFormSubmit = () => {

    let { t, handleClose } = this.props;
    let employeeObject = { ...this.state }

    if (this.state.id) {
      updateEmployee(employeeObject)
        .then((res) => {
          if (res.data.code === 200) {
            toast.success(t("staff.noti.updateSuccess"));
            handleClose();
          } else {
            toast.error(res.data.message);
          }
        });
    } else {
      saveEmployee(employeeObject)
        .then((res) => {
          if (res.data.code === 200) {
            toast.success(t("staff.noti.addSuccess"));
            handleClose();
          } else {
            toast.error(res.data.message);
          }
        })
    };
  }

  getDistrictCommuneProvince() {
    getDistrict()
      .then(({ data }) => this.setState({ listDistrict: [...data.data] }))
      .catch(err => console.log(err))
    getCommune()
      .then(({ data }) => this.setState({ listCommune: [...data.data] }))
      .catch(err => console.log(err))
    getProvince()
      .then(({ data }) => this.setState({ listProvince: [...data.data] }))
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getDistrictCommuneProvince();
  }

  render() {
    let {
      id,
      name,
      code,
      phone,
      email,
      age,
      commune,
      district,
      province,
      listCommune,
      listDistrict,
      listProvince,
    } = this.state;

    let { open, handleClose, t } = this.props;

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
          <h4 className="">{id ? t("general.update") : t("ReceivingAsset.addNew")}</h4>
        </DialogTitle>

        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent>
            <Grid className="" container spacing={2}>

              <Grid item sm={12} xs={12}>
                <TextValidator className="w-100 "
                  label={
                    <span>
                      {t("staff.code")}
                    </span>
                  }
                  required
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
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
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
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
                  onChange={this.handleChange}
                  type="text"
                  name="age"
                  value={age}
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
                  onChange={this.handleChange}
                  type="number"
                  name="phone"
                  value={phone}
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
                  onChange={this.handleChange}
                  type="email"
                  name="email"
                  value={email}
                  validators={['isEmail']}
                  errorMessages={[t("staff.required.email")]}
                />
              </Grid>

              <Grid item sm={4} xs={4}>
                <TextField
                  required
                  select
                  defaultValue=""
                  name="province"
                  label="Tỉnh"
                  value={province}
                  onChange={this.handleChange}
                  helperText="Please select your province"
                >
                  {listProvince.map((province) => (
                    <MenuItem key={province.id} value={province}>
                      {province.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item sm={4} xs={4}>
                <TextField
                  required
                  select
                  defaultValue=""
                  name="district"
                  label="Huyện"
                  value={district}
                  onChange={this.handleChange}
                  helperText="Please select your district"
                >
                  {listDistrict.map((district) => (
                    <MenuItem key={district.id} value={district}>
                      {district.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item sm={4} xs={4}>
                <TextField
                  required
                  select
                  defaultValue=""
                  label="Xã"
                  name="commune"
                  value={commune}
                  onChange={this.handleChange}
                  helperText="Please select your commune"
                >
                  {listCommune.map((commune) => (
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
                onClick={handleClose}
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
    );
  }
}

export default EmployeeDialog;
