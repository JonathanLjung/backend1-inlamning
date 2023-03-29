# Jonathan Ljung Inlämning

Börja med att starta databasen i MYSQL. 

## Hur du använder

Skapa en .env fil och kopiera in detta. Se till så att alla uppgifter är korrekta. 

```
DATABASE_USER="root"
DATABASE_PASSWORD=""
DATABASE_HOST="127.0.0.1"
DATABASE_DATABASE="todo"
```

## För att köra SRC

``` 
npm install
npm run server
```

## Routes

### POST /register
Registrera ny användare i JSON format:

```json 
{
    "username": "Admin",
    "Password": "ABC"
}
```
### POST /login
(Detta ger dig en login cookie som håller i 20minuter.)

Logga in med en registrerad användare: 
```json
{
    "username": "Admin",
    "Password": "ABC"
}
```

### POST /todos
Skapa ny todo i JSON-format:
```json
{
    "title": "Städa vardagsrummet",
    "description": "Väldigt noggrant"
}
```

### GET /todos
Hämtar alla todos för användarens id.

### PUT /todos/:id
Här uppdaterar du din todo med json format: 
```json
{
    "title": "Uppdaterad titel",
    "description": "Uppdaterad beskrivning"
}
```

### PUT /todos/:id/complete
Här uppdaterar du din todos "complete", 1 för sant och 0 för falskt:
```json
{
    "isComplete": false eller true
}
```
## För att använda clienten

```
npm run client (om inte detta fungerar, vänligen öppna client/html/index.html via live server)
```

## Navigera på hemsidan

Nu är det bara att navigera på hemsidan, du behöver först registrera dig för att sedan kunna logga in. Och därefter blir du dirigerad till dashboard, där du kan lägga till, ta bort, klarmarkera samt redigera dina todos. Dessa sparas i en MYSQL databas.