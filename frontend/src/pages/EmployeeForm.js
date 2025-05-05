import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Box,
  Alert,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  department: Yup.string().required('Department is required'),
  position: Yup.string().required('Position is required'),
  employeeType: Yup.string().required('Employee type is required'),
  salary: Yup.number()
    .required('Salary is required')
    .min(0, 'Salary must be positive'),
  hireDate: Yup.date().required('Hire date is required'),
});

const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];
const employeeTypes = ['Full-time', 'Part-time', 'Contract', 'Intern'];

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      employeeType: '',
      salary: '',
      hireDate: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const formData = new FormData();
        
        // Append all form values
        Object.keys(values).forEach(key => {
          if (key === 'address') {
            formData.append(key, JSON.stringify(values[key]));
          } else {
            formData.append(key, values[key]);
          }
        });

        // Append profile picture if selected
        if (selectedFile) {
          formData.append('profilePicture', selectedFile);
        }

        if (id) {
          await axios.put(`/employees/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          await axios.post('/employees', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
        navigate('/employees');
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchEmployee = async () => {
        try {
          const response = await axios.get(`/employees/${id}`);
          const employee = response.data;
          formik.setValues({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            department: employee.department,
            position: employee.position,
            employeeType: employee.employeeType,
            salary: employee.salary,
            hireDate: employee.hireDate.split('T')[0],
            address: {
              street: employee.address?.street || '',
              city: employee.address?.city || '',
              state: employee.address?.state || '',
              zipCode: employee.address?.zipCode || '',
            },
          });
          if (employee.profilePicture) {
            setPreviewUrl(employee.profilePicture);
          }
        } catch (error) {
          setError('Error fetching employee data');
        }
      };
      fetchEmployee();
    }
  }, [id]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Employee' : 'Add New Employee'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={previewUrl}
                  sx={{
                    width: 120,
                    height: 120,
                    margin: '0 auto',
                    fontSize: '3rem',
                    bgcolor: 'primary.main',
                  }}
                >
                  {!previewUrl && formik.values.firstName[0]}{!previewUrl && formik.values.lastName[0]}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-picture"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="profile-picture">
                  <IconButton
                    color="primary"
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Department"
                name="department"
                value={formik.values.department}
                onChange={formik.handleChange}
                error={formik.touched.department && Boolean(formik.errors.department)}
                helperText={formik.touched.department && formik.errors.department}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Employee Type"
                name="employeeType"
                value={formik.values.employeeType}
                onChange={formik.handleChange}
                error={formik.touched.employeeType && Boolean(formik.errors.employeeType)}
                helperText={formik.touched.employeeType && formik.errors.employeeType}
              >
                {employeeTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={formik.values.position}
                onChange={formik.handleChange}
                error={formik.touched.position && Boolean(formik.errors.position)}
                helperText={formik.touched.position && formik.errors.position}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary"
                name="salary"
                type="number"
                value={formik.values.salary}
                onChange={formik.handleChange}
                error={formik.touched.salary && Boolean(formik.errors.salary)}
                helperText={formik.touched.salary && formik.errors.salary}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hire Date"
                name="hireDate"
                type="date"
                value={formik.values.hireDate}
                onChange={formik.handleChange}
                error={formik.touched.hireDate && Boolean(formik.errors.hireDate)}
                helperText={formik.touched.hireDate && formik.errors.hireDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 3, mb: 1 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Address
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Street"
                    name="address.street"
                    value={formik.values.address.street}
                    onChange={formik.handleChange}
                    sx={{ flex: 2, minWidth: 180 }}
                  />
                  <TextField
                    label="City"
                    name="address.city"
                    value={formik.values.address.city}
                    onChange={formik.handleChange}
                    sx={{ flex: 1, minWidth: 120 }}
                  />
                  <TextField
                    label="State"
                    name="address.state"
                    value={formik.values.address.state}
                    onChange={formik.handleChange}
                    sx={{ flex: 1, minWidth: 120 }}
                  />
                  <TextField
                    label="Zip Code"
                    name="address.zipCode"
                    value={formik.values.address.zipCode}
                    onChange={formik.handleChange}
                    sx={{ flex: 1, minWidth: 100 }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/employees')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ minWidth: 100 }}
              >
                {isLoading ? 'Saving...' : id ? 'Update' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EmployeeForm; 