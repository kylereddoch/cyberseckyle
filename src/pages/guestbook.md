---
title: Guestbook
permalink: /guestbook/index.html
description: 'This is the collection of people who have left a message on my guestbook. Feel free to leave a message!'
layout: page
---

<script async src="https://guestbooks.meadow.cafe/resources/js/embed_script/222/script.js"></script> 
<div id="guestbooks___guestbook-form-container">
    <form id="guestbooks___guestbook-form" action="https://guestbooks.meadow.cafe/guestbook/222/submit" method="post">
        <div class="guestbooks___input-container">
            <input placeholder="Name" type="text" id="name" name="name" required>
        </div>
        <div class="guestbooks___input-container">
            <input placeholder="Website (optional)" type="url" id="website" name="website">
        </div>
        <div id="guestbooks___challenge-answer-container"></div>  
        <br/>
        <div class="guestbooks___input-container">
            <textarea placeholder="Message (plain text only)..." id="text" name="text" style="width: 100%; box-sizing: border-box; resize: vertical;" required></textarea>
        </div>
        <br/>
        <input type="submit" value="Submit">
        <div id="guestbooks___error-message"></div>  
    </form>
</div>
<div id="guestbooks___guestbook-made-with" style="text-align: right; margin-top:1em;">
    <small>Lovingly made with <a target="_blank" href="https://guestbooks.meadow.cafe">Guestbooks</a></small>
</div>  

<h3 id="guestbooks___guestbook-messages-header">Messages</h3>
<div id="guestbooks___guestbook-messages-container"></div>