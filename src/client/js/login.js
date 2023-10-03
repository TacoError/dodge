socket.on("err", (e) => {
    const error = notepack.decode(e);
    err(error.info, error.color);
});

socket.on("heroes", (e) => {
    const list = notepack.decode(e);
    for (const name in list) {
        const data = list[name];
        const object = document.createElement("div");
        object.id = `${name}_HERO`;
        const title = document.createElement("h3");
        title.id = `${name}_HERO_TITLE`;
        title.innerHTML = name;
        object.appendChild(title);
        const info = document.createElement("p1");
        info.id = `${name}_HERO_DESCRIPTION`;
        info.innerHTML = `Hero Name: ${name}<br>Unlock by: ${data.unlockBy}<br>Power One: ${data.powerOne}<br>Power Two: ${data.powerTwo}`;
        object.appendChild(info);
        object.onmouseover = () => {
            object.style.backgroundColor = data.color;
        };
        object.onmouseleave = () => {
            object.style.backgroundColor = "white";
        };
        object.onclick = () => {
            socket.emit("selectHero", notepack.encode(name));
            err("", "green");
        };
        object.style.margin = "20px";
        object.style.padding = "20px";
        object.style.width = "300px";
        object.style.outline = `3px dotted ${data.color}`;
        document.getElementById("heroes").appendChild(object);
    }
});

socket.on("loggedIn", () => {
    document.getElementById("initial").style.display = "none";
    document.getElementById("hero-selection").style.display = "block";
});

function err(info, color) {
    document.getElementById("err").innerHTML = info;
    document.getElementById("err").style.color = color;
}

function getLoginInformation() {
    return notepack.encode({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    });
}

function register() {
    lastUsedName = document.getElementById("username").value;
    socket.emit("register", getLoginInformation());
}

function login() {
    lastUsedName = document.getElementById("username").value;
    socket.emit("login", getLoginInformation());
}