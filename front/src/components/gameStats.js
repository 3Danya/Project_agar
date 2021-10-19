export default ({stats}) => {
    return(
            <div className = "games-wrapper">
                {stats.map((s) => 
                        <div key = {s[0].id} className = "games-holder">
                            <div>
                                <h5 style = {{textAlign:"center"}}>{`Winner - ${s[0].name}`}</h5>
                                <ol>
                                    {s.map((p) => <li key = {p.name} className = "games-el"><img className = "chat-avatar" src = {`http://109.86.248.165:12123/images/${p.img}.jpg`}></img>{`${p.name} набрал ${p.size} кг`}</li>)}
                                </ol>
                            </div>
                            <div>
                                <h6 style = {{textAlign:"center"}}>{`Duration : ${Math.floor(s[0].duration / 60 / 60)} h  ${Math.floor(s[0].duration % 3600 / 60)} m ${Math.floor(s[0].duration % 3600 % 60)} s`}</h6>
                                <h6 style = {{textAlign:"center"}}>{(String(new Date(+s[0].time)).slice(0,25))}</h6>
                            </div>
                        </div>
                )}
            </div>
    )
}