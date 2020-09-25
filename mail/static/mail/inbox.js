
document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('click', send);
  
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view').style.display = "none";

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view').style.display = "none";

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  
  // creating a string litral for mailbox to be fetched
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // ... do something else with emails ...
    emails.forEach(email => {
      div = document.createElement('div');
      div.classList.add("mailboxes");
      div.id = email.id;
      div.addEventListener('click', email_boxes);
      
      if (mailbox === "sent"){
        div.innerHTML = `TO <strong>:  ${email.recipients} : </strong>${email.subject} <div>${email.timestamp}</div>`;  
      }
      else{
        if (email.read === false){
          div.style.backgroundColor = "rgb(230, 230, 230)"
        }
        div.innerHTML = `<strong>${email.sender} : </strong>${email.subject} <div>${email.timestamp}</div>`;
      }
      
      document.querySelector('#emails-view').append(div);
    });

  });
}


function send() {
  // Getting the values
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  
  // send email via the POST method
  fetch('emails',{
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    // Printing it to the console
    console.log(result)
    // redirecting to Sent
    load_mailbox('sent')
  });
  return false
}

function email_boxes(e){



  fetch(`/emails/${e.target.id}`)
  .then(response => response.json())
  .then(email =>{
    document.querySelector('#view_from').innerHTML = `From: ${email.sender} : ${email.timestamp}`;
    document.querySelector('#view_subject').innerHTML = `Subject ${email.subject}`;
    document.querySelector('#view_body').innerHTML = email.body;

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#view').style.display = "block";
  });

  fetch(`/emails/${e.target.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })

  })
  
}