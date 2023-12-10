import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { SeverityPill } from 'src/components/severity-pill';
import { getInitials } from 'src/utils/get-initials';
import { Scrollbar } from 'src/components/scrollbar';
import { Button } from '@mui/material';
import FileSaver from 'file-saver';
import axios from 'axios';

import {
  Avatar,
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';

const statusMap = {
  filled: 'success',
  unfilled: 'warning',
};

export const PatientPrescriptionsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  const downloadPDF = async (prescription) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/patient/download-prescription-pdf`,
        { prescription },
        { responseType: 'blob' } // Ensure responseType is set to 'blob' to handle binary data
      );
  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileName = `Prescription_${prescription._id}.pdf`;
  
      // Use FileSaver to trigger the download
      FileSaver.saveAs(blob, fileName);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Drug
                </TableCell>
                <TableCell>
                  Doctor
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((prescription) => {  
                const status = prescription.filled?'filled':'unfilled';
                return (
                  <TableRow hover key={prescription._id}>
                  <TableCell>
                    {/* Map over the Drug array and display drug details */}
                    {prescription.Drug.map((drug, index) => (
                      <div key={index}>
                        <Typography variant="body1">
                          {drug.drugName}
                        </Typography>
                        <Typography variant="body2">
                          Dosage: {drug.dosage}
                        </Typography>
                      </div>
                    ))}
                  </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {prescription.Doctor}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {prescription.Date}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[status]}>
                        {status}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                    <Button onClick={() => downloadPDF(prescription)}>
                      Download PDF
                    </Button>
                  </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

PatientPrescriptionsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
