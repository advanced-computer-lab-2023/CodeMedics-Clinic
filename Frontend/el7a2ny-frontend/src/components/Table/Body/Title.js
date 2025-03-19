import Head from "next/head"

function Title({title}){
    return (
        <Head>
            <title>
                {title}
            </title>
        </Head>
    )
}

export default Title