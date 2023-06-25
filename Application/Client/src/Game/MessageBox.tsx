import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap';

function MessageBox() {
    
    const [poruke, setPoruke] = useState([])
    const [username, setUsername] = useState("")
    const [tekst, setTekst] = useState("")

    useEffect(() => {
        let div = document.getElementById("messageBox");
        if( div != null)
          div.scrollTop = div.scrollHeight - div.clientHeight;
      }, [])



    //   useEffect(() => {

    //     var div = document.getElementById("messageBox");
    //     div.scrollTop = div.scrollHeight - div.clientHeight;

    //     setUsername(sessionStorage.getItem("username"))

    //     const request = {
    //         method: 'GET',
    //         headers: {'Authorization': `bearer ${sessionStorage.getItem("jwt")}`}   
    //     } 
    //     const myInterval = setInterval(() => {
    //         setPoruke([])
    //     }, 1000);
    //       // clear out the interval using the id when unmounting the component

    //       if(poruke.length == 0){
    //         fetch(`https://localhost:7013/Poruka/GetPorukeIzmedjuDvaKor/${props.kor2ID}`, request).then(response => {
    //             if(response.ok)
    //             response.json().then((porukelocal) => {
    //                 setPoruke(porukelocal)      
    //             })
    //         })
    //     }
    //     return () => clearInterval(myInterval);
    // }, [poruke])

    const onSubmit = (event: any) => {
        event.preventDefault()

        if(!username)
        {
            alert('Izostavili ste username')
            return
        }

        // const request = {
        //     method: 'POST',
        //     headers: {'Authorization': `bearer ${sessionStorage.getItem("jwt")}`}
        // } 

        // fetch(`https://localhost:7013/Poruka/CreatePoruka/${props.username2}/${tekst}`, request).then(response => {
        //     if(response.ok)
        //     {
        //         alert("Msg sent")
        //         setPoruke([])
        //     }
        // })
      
      
    }
    return (
        <div>
        <div className='messageBox' id='messageBox'>

            <div className='myMessageWith'><div className='myMessage'>test</div></div>
            <div className='myMessageWith'><div className='myMessage'>test</div></div>
            <div className='myMessageWith'><div className='myMessage'>test</div></div>
            <div className='myMessageWith'><div className='myMessage'>test</div></div>
          {/* {  {poruke.map((poruka) => (poruka.korisnikSnd.username == username) ? 
                    (<div className='myMessageWith' key={poruka.id}>
                        <img className="PanelIcon" src={UserIcon}/> YOU
                        <div className='myMessage'>{poruka.tekst}</div>
                        {new Date(poruka.vreme).toUTCString()}</div>) : 
                    (<div className='theirMessageWith' key={poruka.id}>
                        <img className="PanelIcon" src={UserIcon}/> {poruka.korisnikSnd.username}
                        <div className='theirMessage'>{poruka.tekst}</div>
                        {new Date(poruka.vreme).toUTCString()}</div>)) 
                }} */}

        </div>
            <Form className='sendMessage' onSubmit={onSubmit}>
            <Form.Group className='grMess1'>
                    <Form.Control type='text' placeholder='Type here...' value = {tekst} onChange= { (e) => 
                                setTekst(e.target.value) } />
            </Form.Group>


            <Form.Group className='grMess2'>
                <Button variant="dark" className='messButton' type='submit'>
                    Send
{//                    <img className="PanelIcon" src={SendIcon}/>
}                </Button>
            </Form.Group>

            </Form>
        </div>
    )
}

export default MessageBox