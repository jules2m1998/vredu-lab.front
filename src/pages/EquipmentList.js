import {Button, Container, Grid, Stack, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import Iconify from "../components/Iconify";
import Page from "../components/Page";
import useGet from "../hooks/useGet";
import EquipmentCard from "../components/equipment/EquipmentCard";
import NoContent from "../components/NoContent";
import Loader from "../components/Loaders/Loader";

export default function EquipmentList(){
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const getMethod = useGet()
  
  const init = useCallback(async () => {
    const data = await getMethod("Equipment")
    if (data) setEquipments(data)
    setLoading(false)
    return data
  }, [getMethod]);
  
  useEffect(() => {
    init().then(console.log)
  }, [init]);
  
  if (loading) return <Loader text="Chargement des textures..." />
  
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
        {equipments.length ? <Grid container spacing={3}>
          {
            equipments.map((item, k) => <EquipmentCard onDelete={init} key={k} item={item}/>)
          }
        </Grid>: <NoContent description="Utilisez le boutton de creation ci-dessus pour ajouter un equipement !" />
        }
      </Container>
    </Page>
}