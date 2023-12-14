current_slide = 0;

function back_a_slide() {
    cur_text=document.getElementById("header").textContent
    current_slide = Math.max(0, current_slide - 2);
    if (document.getElementById("previous").innerHTML=="Previous (info)") {
        document.getElementById("previous").innerHTML="First slide..."
        document.getElementById("next").innerHTML=`Next (${cur_text})`
        showDesc();
        document.getElementById("previous").classList.add("disabled")
        return
    } 
    switch_slide();
}
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
slides = [
    "blueberryos;spartanproj/os",
    "dispatch-x;dispatch-x/api",
    "wikicloud;werdl/wikicloud",
    "rosemary;spartanproj/Rosemary",
    "cxf;werdl/cxf",
    "utils;werdl/utils",
    "livec;werdl/livec",
    "safile;werdl/safile",
    "ip_str;werdl/ip_str",
    "libntp;werdl/libntp",
    "fibonacci;werdl/fibonacci",
    "jsonfeed;werdl/jsonfeed",
    "color;werdl/color",
    "vcss;werdl/vcss",
    "pyclr;werdl/pyclr",
    "doc;werdl/doc",
    "browser;werdl/browser",
    "pyt;werdl/pyt",
    "samik;werdl/samik",
    "chat;werdl/chat",
    "bottles;werdl/bottles",
    "mtx;werd/mtx"
]


function showDesc() {
    
    document.getElementById("header").innerHTML=`    <h2>werdl's portfolio</h2>
    `
    document.getElementById("content").innerHTML=`
    <p>Hi! I'm werdl, an aspiring developer who enjoys coding low level stuff (and the odd website)</p>
    <h3>My Skills</h3>
    <ul>
        <li><a href="http://gcc.gnu.org">C</a></li>
        <li><a href="http://python.org">Python</a></li>
        <li><a href="http://vlang.io">V</a></li>
    </ul>
    <br>
    <ul>
        <li><a href="http://git-scm.com">Git</a></li>
        <li><a href="http://github.com">Github</a></li>
        <li><a href="http://gnu.org/software/make">Makefile</a></li>
        <li><a href="http://code.visualstudio.com">VS Code</a></li>
        <li><a href="http://neovim.io">Neovim</a></li>
    </ul>
    <br>
    <ul>
        <li><a href="http://debian.org">Debian</a></li>    
        <li><a href="https://en.wikipedia.org/wiki/Unix">Unix</a></li>
    </ul>`
}

function hideDesc() {
    document.getElementById("content").innerHTML = `
    <div id="languageBox" class="language-box"><div class="lds-ripple"><div></div><div></div></div></div>
    </div>
    <br>
    <div id="commits"></div>
    <br>
    <div id="desc"></div>
    <br>
    <div id="readme"></div>
    `
}

function toggleLoadingAnimation() {
}

function switch_slide() {
    toggleLoadingAnimation();
    hideDesc();
    current_slide++;

    let cur = slides[current_slide];



    semi = cur.split(";")
    name_repo = semi[0]
    link = semi[1].split("/")
    owner = link[0]
    tag = link[1]
    prev = slides[current_slide - 1].split(";")[0]

    document.getElementById("previous").classList.remove("disabled")
    next=slides[current_slide + 1].toString().split(";")[0]

    

    document.getElementById("previous").innerHTML = `Previous (${prev})`
    document.getElementById("next").innerHTML = `Next (${next})`
    document.getElementById("projectcount").innerHTML = `${slides.indexOf(cur)}/${slides.length - 2}`


    document.getElementById("header").innerHTML = `<h2><a href='https://github.com/${owner}/${tag}' id='title'>` + "</a></h2>"
    scramble("title", name_repo)


    fetchLangs(owner, tag)
        .then(data => {
            updateLanguageInfo(data)
        })

    fetchCommits(owner, tag)
        .then(loc => {
            console.log(document.getElementById('commits').innerHTML)
            document.getElementById('commits').innerHTML = `<b>${loc}</b> commit${loc == 1 ? "" : "s"} on this repo`
        })
    fetchRepoInfo(owner, tag)
        .then(description => {
            document.getElementById('desc').textContent = description[0] || 'I forgot to put a description here.';

            default_branch = description[1]
            console.log(description)


        }).catch(error => console.error('Error fetching repository information:', error))

    // Fetch README content and render it in HTML
    fetchReadmeContent(owner, tag)
        .then(renderHTML)
        .catch(error => console.error('Error fetching README:', error));
    if (slides[current_slide + 1]=="n/a;") {
        document.getElementById("next").classList.add("disabled")
        document.getElementById("next").innerHTML="Last slide..."
    } else {
        document.getElementById("next").classList.remove("disabled")
    }
    toggleLoadingAnimation();
}
const accessToken = "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"
// please don't take, from a burner account
async function fetchRepoInfo(username, repo) {
    const response = await fetch(`https://github-api-proxy--werdliscool.repl.co/?route=https://api.github.com/repos/${username}/${repo}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    console.log(data)
    return [data.description, data.default_branch];
}


async function fetchLangs(username, repo) {
    const response = await fetch(`https://github-api-proxy--werdliscool.repl.co/?route=https://api.github.com/repos/${username}/${repo}/languages`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}

async function fetchCommits(username, repo) {
    const response = await fetch(`https://github-api-proxy--werdliscool.repl.co/commits?user=${username}&repo=${repo}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}

async function fetchReadmeContent(username, repo) {
    const response = await fetch(`https://github-api-proxy--werdliscool.repl.co/?route=https://api.github.com/repos/${username}/${repo}/readme`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return atob(data.content) // Decode base64-encoded content
}
// Function to render HTML content using Showdown library
function renderHTML(markdownContent) {
    const converter = new showdown.Converter();
    const htmlContent = converter.makeHtml(markdownContent);
    document.getElementById('readme').innerHTML = htmlContent;
}



// Fetch data from the GitHub API


// Function to update language info on the page
function updateLanguageInfo(data) {
    const languageBox = document.getElementById('languageBox');
    if (!data || Object.keys(data).length === 0) {
        languageBox.innerHTML = '<div class="language">Data not available</div>';
    } else {
        languageBox.innerHTML = '';


        Object.entries(data).forEach(([language, bytes]) => {
            const percent = ((bytes / getTotalBytes(data)) * 100).toFixed(2);
            const randomColor = getRandomColor();

            const languageElement = document.createElement('div');
            languageElement.classList.add('language');
            languageElement.innerHTML = `
                <span id="lang" class="language-name" style="color: ${randomColor};">${language}</span>
                <span class="language-percent">${Math.round(parseFloat(percent) * 10) / 10}%</span>
            `;

            languageBox.appendChild(languageElement);
        });
    }
}

// Helper function to get the total bytes
function getTotalBytes(data) {
    return Object.values(data).reduce((acc, bytes) => acc + bytes, 0);
}

// Helper function to generate a random color
function getRandomColor() {
    x = `rgb(${Math.round(Math.random() * 100)},${Math.round(Math.random() * 100) + 155},${Math.round(Math.random() * 150)});`;
    console.log(x)
    return x
}

isdark = false;

function getContrastColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000' : '#fff';
}

/* JavaScript function to toggle dark mode */
function toggleDarkMode() {
    const body = document.body;
    const wrapper = document.querySelector('.wrapper');
    const buttons = document.querySelectorAll('.button');

    body.classList.toggle('dark-mode');
    wrapper.classList.toggle('dark-mode');



    // Apply text color based on background brightness
    buttons.forEach(button => {
        const bgColor = window.getComputedStyle(button).getPropertyValue('background-color');
        const contrastColor = getContrastColor(bgColor);
        button.style.color = contrastColor;
    });
    isdark = !isdark;
    if (isdark) {
        body.style.backgroundColor = "#222";

    } else {
        body.style.backgroundColor = "white";
    }
}
function prependArray(value, oldArray) {
    var newArray = new Array(value);

    for (var i = 0; i < oldArray.length; ++i) {
        newArray.push(oldArray[i]);
    }

    return newArray;
}

async function scramble(s, content) {

    async function revealTextWithDelay(selector) {
        const text = content
        const element = document.getElementById(selector);
        const revealDuration = text.length * 100;
        const revealInterval = revealDuration / text.length;

        // Add a random delay
        const randomDelay = Math.random() * 100; // Adjust the maximum delay as needed
        await new Promise(resolve => setTimeout(resolve, randomDelay));

        let index = 0;

        function revealCharacter() {
            if (index <= text.length) {
                const partialText = text.slice(0, index);
                element.textContent = partialText;
                index++;
                setTimeout(revealCharacter, revealInterval);
            }
        }

        revealCharacter();
    }

    // Apply the effect to each selector with a random short delay
    await revealTextWithDelay(s);

}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("wrapper").style.display = "none"
    // Initialising the canvas
    var canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');

    // Setting the width and height of the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Setting up the letters
    var letters = '01';
    for (let j = 0; j < 100; j++) {
        letters += Math.round(Math.random()) == 0 ? "0" : "1"
    }
    letters = letters.split('');

    // Setting up the columns
    var fontSize = 10,
        columns = canvas.width / fontSize;

    // Setting up the drops
    var drops = [];
    for (var i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }

    const fallingText = "loading"

    // Setting up the draw function
    async function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, .1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw centered text
        ctx.fillStyle = '#0f0';
        ctx.font = '60px Retro Gaming'; // Adjust the font size and style as needed
        ctx.textAlign = 'center';
        ctx.fillText(fallingText, canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'rgba(0, 0, 0, .1)';
        ctx.font = '15px Retro Gaming'
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < drops.length; i++) {
            var text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillStyle = '#0f0';
            ctx.font = 'Retro Gaming'
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            drops[i]++;
            if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
                drops[i] = 0;
            }
        }
    }


    setInterval(draw, 33)
    const x = setTimeout(function () {
        document.getElementById("letters").style.display = "none"
        shuffle(slides)
        slides = prependArray("info;ignore/ignore", slides)
        slides.push("n/a;")
        showDesc();
        document.getElementById("wrapper").style.display = "flex"
    }, (Math.random() * 1000) + 2000)


})