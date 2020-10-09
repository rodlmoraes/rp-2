import {
  Container,
  Paper,
  Table,
  TableRow,
  TableCell,
  makeStyles,
  Theme,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import api from '@rp-2/axios'

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import PageHeader from '../components/PageHeader'

type MaterialListState = {
  query: string
}

export default function MaterialList() {
  const { state } = useLocation<MaterialListState>()
  const [materials, setMaterials] = useState<Material[]>([])
  const history = useHistory()

  useEffect(() => {
    SpeechRecognition.startListening({ language: 'pt-BR', continuous: true })
  }, [])

  useEffect(() => {
    requestMaterials(state?.query || '').then(setMaterials)
  }, [state])

  const commands = [
    {
      command: 'voltar',
      callback: () => history.push('/'),
    },
  ]

  useSpeechRecognition({ commands })

  const { container, head, cell } = useStyles()

  return (
    <>
      <PageHeader title={`Encontramos ${materials.length} material para a pesquisa: "${state.query}"`} />
      <Container className={container} component={Paper}>
        <Table>
          <TableRow className={head}>
            <TableCell className={cell}>Título</TableCell>
            <TableCell className={cell}>Professor</TableCell>
          </TableRow>
          {materials.map(({ name, material }) => (
            <TableRow key={name}>
              <TableCell className={cell}>{material}</TableCell>
              <TableCell className={cell}>{name}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Container>
    </>
  )
}

type Material = {
  avatar: string
  bio: string
  material: string
  name: string
  phone: string
  subject: string
  userId: string
}
const requestMaterials = async (subject: string): Promise<Material[]> => {
  try {
    const { data } = await api.get('classes', { params: { subject } })
    return data
  } catch (error) {
    alert(error.message || 'Nenhum professor foi encontrado')
    return []
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: '3.5rem',
    padding: 0,
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
  },
  head: {
    backgroundColor: theme.palette.secondary.main,
  },
  cell: {
    fontSize: '2rem',
  },
}))
