import { GetServerSideProps } from "next";
import styles from "./styles.module.css";
import Head from "next/head";
import { FormEvent, useEffect } from "react";
import { getSession } from "next-auth/react";
import { Textarea } from "../../components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import db from "../api/auth/db_conection";
import Link from "next/link";

interface UsuarioProps {
  usuario: {
    email: string;
    nome: string;
    avatar: string;
  };
}

interface TarefaProps {
  id: string;
  tarefa: string;
  check: boolean;
  data: string;
  usuario: string;
}

export default function Dashboard({ usuario }: UsuarioProps) {
  const [input, setInput] = useState('')
  const [check, setCheck] = useState(false)
  const [tarefas, setTarefas] = useState<TarefaProps[]>([]);

  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, 'Tarefas')
      const q = query(tarefasRef, orderBy('data', 'desc'), where('user', '==', usuario?.email))

      onSnapshot(q, (snapshot) => {
        let lista = [] as TarefaProps[]

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            check: doc.data().check,
            data: doc.data().data,
            usuario: doc.data().user
          })
        })
        setTarefas(lista)
      })
    }

    loadTarefas()

  }, [usuario?.email])

  // Insere nova tarefa no banco de dados
  function novaTarefa(e: FormEvent) {
    e.preventDefault()
    if (input === '') {
      alert("Preencha o campo de tarefa!")
      return
    }
    try {
      addDoc(collection(db, 'Tarefas'), {
        tarefa: input,
        check: check,
        user: usuario?.email,
        data: new Date()
      })

      setInput('')
      setCheck(false)

    } catch (erro) {
      alert("Algo deu errado!")
      console.log(erro)
    }

  }

  function copiar(id: string) {
    navigator.clipboard.writeText(`http://localhost:3000/tarefas/${id}`)
    alert("Link copiado com sucesso!")
  }

  async function deletaTarefa(id: string) {
    await deleteDoc(doc(db, 'Tarefas', id))
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>

            <form onSubmit={novaTarefa}>
              <Textarea placeholder="Digite qual sua tarefa..." value={input} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { setInput(e.target.value) }} />
              <div className={styles.checkboxArea}>
                <input type="checkbox" className={styles.checkbox} checked={check} onChange={(e: ChangeEvent<HTMLInputElement>) => { setCheck(e.target.checked) }} />
                <label>Deixar tarefa publica?</label>
              </div>

              <button className={styles.button} type="submit">
                Registrar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>

          {tarefas.map((item) => (
            <article key={item.id} className={styles.task}>
              <div className={styles.tagContainer}>
                <label className={styles.tag}>{item.check ? 'PÚBLICO' : 'PRIVADO'}</label>
                <button className={styles.shareButton} onClick={()=>{copiar(item.id)}}>
                  <FiShare2 size={22} color="#3183ff" />
                </button>
              </div>

              <div className={styles.taskContent}>
                {item.check? <Link href={`/tarefas/${item.id}`}><p>{item.tarefa}</p></Link> : <p>{item.tarefa}</p>}
                <button className={styles.trashButton} onClick={() => { deletaTarefa(item.id) }}>
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  // console.log(session);

  if (!session?.user) {
    // Se não tem usuario vamos redirecionar para /
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      usuario: {
        email: session?.user?.email,
        nome: session.user.name,
        avatar: session.user.image
      }
    },
  };
};
