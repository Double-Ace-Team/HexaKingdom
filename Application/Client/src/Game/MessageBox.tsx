import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Message } from '../Model/Message';
import { sendMessage } from '../services/game.service';


interface Props
{
  gameID: string | undefined;
  poruke: Message[] | undefined;

}

function MessageBox(props: Props) {
    
    //const [poruke, setPoruke] = useState([])
    const [username, setUsername] = useState<String>("")
    const [tekst, setTekst] = useState("")

    useEffect(() => {
        
        let username: string = localStorage.getItem("username")!;
        setUsername(username);

        let div = document.getElementById("messageBox");

        if( div != null)
          div.scrollTop = div.scrollHeight - div.clientHeight;
      }, [props.poruke])



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

        if(!username || !props.gameID || !tekst)
        {
            alert('Izostavili ste username')
            
        }
        else
        {   
            setTekst("");
            
            sendMessage(props.gameID, tekst);
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

                {props.poruke?.map((poruka : Message) => (poruka.username == username) ? 
                        (<div className='myMessageWith' key={poruka._id}>
                            <img className="PanelIcon" /*src={UserIcon}*//> YOU
                            <div className='myMessage'>{poruka.text}</div>
                            {new Date(poruka.createdAt).toUTCString()}
                        </div>) 
                        : 
                        (<div className='theirMessageWith' key={poruka._id}>
                            <img className="PanelIcon" /*src={UserIcon}*//> {poruka.username}
                            <div className='theirMessage'>{poruka.text}</div>
                            {new Date(poruka.createdAt).toUTCString()}
                        </div>)) 
                    }

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