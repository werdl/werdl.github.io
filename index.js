current_slide=0;

function back_a_slide() {
    current_slide-=2;
    switch_slide();
}
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
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
    "bottles;werdl/bottles"
]
function switch_slide() {
    current_slide++

    let cur=slides[current_slide]
    
    semi=cur.split(";")
    name_repo=semi[0]
    link=semi[1].split("/")
    owner=link[0]
    tag=link[1]

    prev=slides[current_slide-1].split(";")[0]
    document.getElementById("previous").innerHTML=`Previous (${prev})`
    document.getElementById("next").innerHTML=`Next (${slides[current_slide+1].split(";")[0]})`
    document.getElementById("projectcount").innerHTML=`${slides.indexOf(cur)}/${slides.length-2}`

    fetchLangs(owner, tag)
    .then(data => {
        updateLanguageInfo(data)
    })
    
        // Fetch README content and render it in HTML
        fetchReadmeContent(owner, tag)
            .then(renderHTML)
            .catch(error => console.error('Error fetching README:', error));

        
        fetchRepoInfo(owner, tag)
            .then(description => {
                document.getElementById('desc').textContent = description[0] || 'No description available.';

                default_branch=description[1]
                console.log(description)

                fetchCommits(owner, tag)
                .then(loc => {
                    console.log(document.getElementById('commits').innerHTML)
                    document.getElementById('commits').innerHTML=`<b>${loc}</b> commit${loc==1?"":"s"} on this repo`
                })
            })
            .catch(error => console.error('Error fetching repository information:', error))
        
    document.getElementById("header").innerHTML = `<h2><a href='https://github.com/${owner}/${tag}'>`+name_repo+"</a></h2>"



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
                <span class="language-name" style="color: ${randomColor};">${language}</span>
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
    const letters = '6789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
}

isdark=false;

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
    isdark=!isdark;
    if (isdark) {
        body.style.backgroundColor = "#222";

    } else {
        body.style.backgroundColor = "white";
    }
}
function prependArray(value, oldArray) {
    var newArray = new Array(value);
  
    for(var i = 0; i < oldArray.length; ++i) {
      newArray.push(oldArray[i]);
    }
  
    return newArray;
}

window.onload=function () {
    shuffle(slides)
    slides=prependArray("n/a;", slides)
    slides.push("n/a;")
    switch_slide();

}