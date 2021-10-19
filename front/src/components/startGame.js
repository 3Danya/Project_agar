import { useEffect, useState } from "react"
import {Link, Redirect} from 'react-router-dom';

export default () => {
    const [color,setColor] = useState("")
    return(
            <main className = "main">
                <div className = "start">
                    <div className = "start-form">
                        <h5>Choose your color</h5>
                        <input style = {{margin:"0 auto"}} type="color" className="form-control form-control-color" id="exampleColorInput" value = {color} onChange = {(e) => setColor(e.target.value)} />
                        <div className = 'link-btn'>
                            <Link className = 'link' to = {`/agar/${color.slice(1) || 'red'}`} >Play agar.io</Link>
                        </div>
                    </div>
                </div>
            </main>
    )
}