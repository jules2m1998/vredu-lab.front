import {Button, Container, Grid, Stack, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import Iconify from "../components/Iconify";
import Page from "../components/Page";
import useGet from "../hooks/useGet";
import EquipmentCard from "../components/equipment/EquipmentCard";

export default function EquipmentList(){
  const [equipments, setEquipments] = useState([]);
  const getMethod = useGet()
  
  const init = useCallback(async () => {
    const data = await getMethod("Equipment")
    if (data) setEquipments(data)
    return data
  }, [getMethod]);
  
  useEffect(() => {
    init().then(console.log)
  }, [init]);
  
  return <Page title="Dashboard: Blog">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Equipements
          </Typography>
          <Button variant="contained" component={RouterLink} to="/dashboard/equipments/form" startIcon={<Iconify icon="eva:plus-fill" />}>
            Nouvelle equipement
          </Button>
        </Stack>
        <Grid container spacing={3}>
          {
            equipments.map((item, k) => <EquipmentCard onDelete={init} key={k} item={item} />)
          }
        </Grid>
      </Container>
    </Page>
}