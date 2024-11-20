import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import db from '../api/auth/db_conection'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import styles from "./styles.module.css";
import { Textarea } from '../../components/textarea'
import { useSession } from 'next-auth/react'
import { FaTrash } from "react-icons/fa";

interface TarefasProps {
  tarefaFormatada: {
    id: string
    tarefa: string
    check: boolean
    data: string
    user: string
  }
  todosComentarios: comentariosProps[]
}

interface comentariosProps {
  id: string
  idTarefa: string
  comentario: string
  nome: string
  user: string
}

const Tarefas = ({ tarefaFormatada, todosComentarios }: TarefasProps) => {
  const { data: session } = useSession()
  const [input, setInput] = useState('')
  const [comentarios, setComentarios] = useState<comentariosProps[]>(todosComentarios || [])

  async function comentar(e: FormEvent) {
    e.preventDefault()
    if (!session?.user?.name || !session.user.email) {
      alert('Faça o login para comentar!')
      return
    }

    if (input === '') {
      alert('Digite um comentário!')
      return
    }
    
    try{
      const docRef = await addDoc(collection(db, 'Comentarios'), {
        idTarefa: tarefaFormatada?.id,
        comentario: input,
        user: session?.user?.email,
        data: new Date(),
        nome: session?.user?.name,
      })

      const data = {
        id: docRef.id,
        comentario: input,
        user: session?.user?.email,
        nome: session?.user?.name,
        idTarefa: tarefaFormatada?.id
      };

      setComentarios((oldItems) => [...oldItems, data]);
      setInput("");

    }catch(erro){
      console.log(erro)
    }
  }

  async function deletaComentario(id: string) {
    try {
      const docRef = doc(db, "Comentarios", id);
      await deleteDoc(docRef);

      const deletComment = comentarios.filter((item) => item.id !== id);

      setComentarios(deletComment);
    } catch (erro) {
      alert('Erro ao deletar comentário');
      console.log(erro);
    }
  }

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

        <form onSubmit={comentar}>
          <Textarea placeholder="Digite seu comentário..." value={input} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} />
          <button className={styles.button}>Enviar comentário</button>
        </form>
      </section>

      <section className={styles.commentsContainer}>
        <h2>Todos comentários</h2>
        {comentarios.length === 0 && (
          <span>Nenhum comentário foi encontrado...</span>
        )}

        {comentarios.map((item) => (
          <article key={item.id} className={styles.comment}>
            <div className={styles.headComment}>
              <label className={styles.commentsLabel}>{item.nome}</label>
              {item.user === session?.user?.email && (
                <button
                  className={styles.buttonTrash}
                  onClick={() => deletaComentario(item.id)}
                >
                  <FaTrash size={18} color="#EA3140" />
                </button>
              )}
            </div>
            <p>{item.comentario}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default Tarefas

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string
  const docRef = doc(db, 'Tarefas', id)
  
  const q = query(collection(db, 'Comentarios'), where('idTarefa', '==', id))
  const snapshotComentarios = await getDocs(q)
  
  let todosComentarios: comentariosProps[] = []
  
  snapshotComentarios.forEach((doc) => {
    todosComentarios.push({
      id: doc.id,
      idTarefa: doc.data().idTarefa,
      comentario: doc.data().comentario,
      nome: doc.data().nome,
      user: doc.data().user
    })
  })
  
  const snapshot = await getDoc(docRef)
  
  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  if (!snapshot.data()?.check) {
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
      tarefaFormatada,
      todosComentarios
    }
  }
}