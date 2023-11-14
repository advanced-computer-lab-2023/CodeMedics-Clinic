import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
  } from '@mui/material';
  
  export const OverviewPackageInfo = ({curPackage}) => {
    


    return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            component="img"
            src={`/assets/Packages/${curPackage.Name}.jpg`}
            sx={{
              borderRadius: '100%',
              height: 150,
              mb: 2,
              width: 150
              
            }}
          />
        </Box>
      </CardContent>
      <Divider />
    </Card>
  )};
  