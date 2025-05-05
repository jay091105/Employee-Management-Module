import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`/employees/${id}`);
        setEmployee(response.data);
      } catch (error) {
        setError('Error fetching employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Paper>
      </Container>
    );
  }

  if (error || !employee) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error || 'Employee not found'}</Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/employees')}
            sx={{ mt: 2 }}
          >
            Back to Employees
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/employees')}
          >
            Back to Employees
          </Button>
          {user?.role === 'admin' && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/employees/${id}/edit`)}
            >
              Edit
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                fontSize: '3rem',
                bgcolor: 'primary.main',
              }}
            >
              {employee.firstName[0]}{employee.lastName[0]}
            </Avatar>
            <Typography variant="h4" sx={{ mt: 2 }}>
              {employee.firstName} {employee.lastName}
            </Typography>
            <Chip
              label={employee.status}
              color={employee.status === 'active' ? 'success' : 'error'}
              sx={{ mt: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{employee.email}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1">{employee.phone}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Department
            </Typography>
            <Typography variant="body1">{employee.department}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Position
            </Typography>
            <Typography variant="body1">{employee.position}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Salary
            </Typography>
            <Typography variant="body1">
              ${employee.salary.toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Hire Date
            </Typography>
            <Typography variant="body1">
              {new Date(employee.hireDate).toLocaleDateString()}
            </Typography>
          </Grid>

          {employee.address && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {employee.address.street}
                </Typography>
                <Typography variant="body1">
                  {employee.address.city}, {employee.address.state} {employee.address.zipCode}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default EmployeeDetails; 