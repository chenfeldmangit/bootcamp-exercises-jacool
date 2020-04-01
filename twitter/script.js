const jacobProfile = {
    "name": "Jacob Eckel",
    "bio": "Software developer since the last century",
    "handle": "@eckely",
    "posts": [
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown" +
        "printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic" +
        "typesetting, remaining essentially unchanged.",
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC," +
        "making it over 2000 years old.",
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout." +
        "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here," +
        "content here', making it look like readable English."
    ]
};

function profileClick() {
    document.getElementById("profile-container").style.display = "flex";
    document.getElementById("feed-container").style.display = "none";

    document.getElementById("profile-top-name").textContent = jacobProfile.name;
    document.getElementById("profile-name").textContent = jacobProfile.name;
    document.getElementById("profile-handle").textContent = jacobProfile.handle;
    document.getElementById("profile-bio").textContent = jacobProfile.bio;

    const myTweets = document.getElementById("my-tweets");
    const template = document.getElementById("post-container-template").content;
    jacobProfile.posts.forEach(text => {
        const post = template.cloneNode(true);
        post.querySelector(".post-text").textContent = text;
        myTweets.appendChild(post);
    });
}

function editProfileClick() {
    document.getElementById("profile-edit-modal").style.display = "flex";
    document.getElementById("name-field").value = document.getElementById("profile-name").textContent;
    document.getElementById("bio-field").value = document.getElementById("profile-bio").textContent;

    Array.from(document.getElementsByClassName("profile-edit-field-container")).forEach(container => {
            const input = container.querySelector(".profile-edit-input");
            const counter = container.querySelector(".counter");
            counter.textContent = input.value.length.toString();
            input.addEventListener("input", () => {
                const length = input.value.length;
                counter.textContent = length.toString();
                if (length === 0)
                    input.style.borderBottomColor = "red";
            });
            input.style.borderBottomColor = ""; // resetting it to the CSS style
        }
    );
}

function saveProfileClick() {
    const textContent = document.getElementById("name-field").value;
    if (textContent.length === 0) {
        alert("Name must be provided");
        return;
    }

    document.getElementById("profile-top-name").textContent = textContent;
    document.getElementById("profile-name").textContent = textContent;
    document.getElementById("profile-bio").textContent = document.getElementById("bio-field").value;
    closeModal();
}

function closeModal() {
    document.getElementById("profile-edit-modal").style.display = "none";
}

class Tweets {
    static async tweet() {
        const text = document.getElementById("twitting-input").value;
        const post = {
            "author": "Jacob Eckel",
            "text": text,
            "uid": (Math.round(Math.random()*1000000000000000)).toString()
        };
        Tweets.addPostToDOM(post);
        await Tweets.addPostToLocal(post);
    }

    static addPostToDOM(post) {
        const tweets = document.getElementById("feed");
        const templateContent = document.getElementById("tweet-template").content;
        const postElem = templateContent.cloneNode(true);
        postElem.querySelector(".author").textContent = post.author;
        postElem.querySelector(".post-text").textContent = post.text;
        const postContainer = postElem.querySelector("[data-post-id]");
        postContainer.setAttribute("data-post-id", post.uid);
        const deletePostButton = postContainer.querySelector("[data-delete-button]");
        deletePostButton.addEventListener("click", () => Tweets.deleteTweet(post.uid, postContainer));
        tweets.appendChild(postElem);
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    static async readPosts() {
        await Tweets.sleep(3000);
        const tweets = localStorage.getItem(Tweets.KEY);
        if (tweets == null)
            return [];
        return JSON.parse(tweets);
    }

    static async addPostToLocal(post) {
        const posts = await Tweets.readPosts();
        posts.push(post);
        localStorage.setItem(Tweets.KEY, JSON.stringify(posts));
    }

    static async removePostFromLocal(uid) {
        const posts = await Tweets.readPosts();
        const filtered = posts.filter(value => value.uid !== uid);
        localStorage.setItem(Tweets.KEY, JSON.stringify(filtered));
    }

    static async onLoad() {
        const posts = await Tweets.readPosts();
        document.getElementById("throbber").style.display = "none";
        posts.forEach(p => Tweets.addPostToDOM(p));
    }

    static async deleteTweet(uid, postContainer) {
        postContainer.remove();
        await Tweets.removePostFromLocal(uid);
    }
}
Tweets.KEY = "tweets";
