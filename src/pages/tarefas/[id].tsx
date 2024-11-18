import { doc, getDoc } from 'firebase/firestore'
import db from '../api/auth/db_conection'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React from 'react'

const Tarefas = () => {
    return (
        <div>
            <Head>Detalhes da Tarefas </Head>
        </div>
    )
}

export default Tarefas

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string

    const docRef = doc(db, 'Tarefas', id)
    const snapshot = await getDoc(docRef)

    if (snapshot.data() === undefined || !snapshot.data()?.check) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const converteData = snapshot.data()?.data?.seconds * 1000

    const tarefaFormatada = {
        id: id,
        tarefa: snapshot.data()?.tarefa,
        check: snapshot.data()?.check,
        data: new Date(converteData).toLocaleDateString(),
        user: snapshot.data()?.user,
    }

    return {
        props: {
            id: params?.id
        }
    }
}