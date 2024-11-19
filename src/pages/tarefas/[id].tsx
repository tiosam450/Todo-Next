import { doc, getDoc } from 'firebase/firestore'
import db from '../api/auth/db_conection'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React from 'react'
import styles from "./styles.module.css";
import { Textarea } from '../../components/textarea'

interface TarefasProps {
    tarefaFormatada: {
        id: string
        tarefa: string
        check: boolean
        data: string
        user: string
    }
}

const Tarefas = ({ tarefaFormatada }: TarefasProps) => {
    return (
        <div className={styles.container}>
        <Head>
          <title>Detalhes da tarefa</title>
        </Head>
  
        <main className={styles.main}>
          <h1>Tarefa</h1>
          <article className={styles.task}>
            <p>{tarefaFormatada.tarefa}</p>
          </article>
        </main>
  
        <section className={styles.commentsContainer}>
          <h2>Deixar comentário</h2>
  
          <form>
            <Textarea placeholder="Digite seu comentário..." />
            <button className={styles.button}>Enviar comentário</button>
          </form>
        </section>
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

    console.log(tarefaFormatada)

    return {
        props: {
            tarefaFormatada
        }
    }
}