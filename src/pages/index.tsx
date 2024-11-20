import Head from "next/head";
import styles from "../../src/styles/home.module.css";
import Image from "next/image";

import heroImg from "../../public/assets/hero.png";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { collection, getDocs } from "firebase/firestore";
import db from "./api/auth/db_conection";

interface dadosProps{
  postagens: number
  comentarios: number
}

export default function Home({ postagens, comentarios }: dadosProps) {
  return (
    <div className={styles.container}>
     <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Logo Tarefas+"
            src={heroImg}
            priority
          />
        </div>
        <h1 className={styles.title}>
          Sistema feito para você organizar <br/>
          seus estudos e terefas
        </h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            {postagens === 1 ? <span>+{postagens} tarefa</span> : <span>+{postagens} tarefas</span>}
          </section>
          <section className={styles.box}>
            {comentarios === 1 ? <span>+{comentarios} comentário</span> : <span>+{comentarios} comentários</span>}
          </section>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  const postagens = await getDocs(collection(db, "Tarefas"));
  const comentarios = await getDocs(collection(db, 'Comentarios'));

  // if (session?.user) {
  //   // Se tem usuario vamos redirecionar para a pagina de dashboard
  //   return {
  //     redirect: {
  //       destination: "/dashboard",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {
      postagens: postagens.size || 0,
      comentarios: comentarios.size || 0,
    },
  };
};

