#    WHAT IS JWT
    - Base64 Encoded URL safe string
    - It is encoded and NOT Encrypted
        - Means anything stored inside jwt can be easily visible by using a base64 decoder or 
        - anyone having access to that jwt can access the content.
        - SO DON'T STORE SENSITIVE INFORMATION INSIDE JWT

    - Typical JWT: xxxx.yyyy.zzzz
                Header.Payload.Signature
    Header: algorithm used (HMAC SHA256) and type of token (jwt).
    Payload: Contains claims. => simple key-value pairs
    Signature: used to verify if the token wasn't changed along the way.

#### TOKEN FLOW
   
`CLIENT                 <<<<<<<<<<------------------------->>>>>>>>>>>                 SERVER`

#### WHY WE NEED TWO TOKENS

    - Afer a successful authentcation we send back two tokens back to client containing the client id as payload in the audience claim
        1. ACCESS TOKEN ( validity: 1hour)
        2. REFRESH TOKEN ( validity: 1 year or so)
    - Access tokens are used to access Protected routes.
    - Refresh tokens are user to get a New pai of access tokens and refresh token.
    - The previous refresh token is `blacklisted` by overwriting the old refresh token with the new one in `redis`
    - To LOGOUT we simple remove the access token & refresh token client side and we remove refresh token from redis as well.

#### NPM PACKAGES

    * express
    * bcrypt
    * mongoose
    * dotenv
    * jsonwebtoken => to generate tokens like auth-token, refresh-tokens
    * http-errors
    * redis
    * nodemon
    * @hapi/joi    => The most powerful schema description langauage and data validator for Javascript
    * morgan (not imp)
    * bcrypt  => hashing the password.


#### Route endpoints
    - http://localhost:8080/auth/register
    - http://localhost:8080/auth/login
    - http://localhost:8080/auth/logout
    - http://localhost:8080/auth/refresh-token


#### REDIS
    - database used to store data in key-value pairs
    - can store data like one datastructure pointing to another e.g [] = {}
    - Make different queries to database.
    
    - Why we need =>
        - in mongoDB we have to invest more memory even if we need to store 1mb of data
        - whereas redis only take 2-4 MB of data

        Resulting in =>
         1. low latency ( means can do same task in very less time )
         2. high throuhgput ( can do more task in the same amount of time )
    
    - Use:- caching


## TYPE OF DATABASE

*** SQL *** sequential query language
        ```js
        [[],[],[]] tables containing keys as id-name-age
        ```
        - We can relate two tables by using one some relationship
        - To setup relationship we need to give a column to another table
    
*** NO-SQL *** no- sequential query language

       - MONGODB

*** K-V *** key-value database =>  redix  used for caching => frequently used data ***

*** graph-db ***

=========================================================

## CACHING

- SQL - MySQL, Postgres
- NoSQL - MongoDB,
- GraphDB - neo4j
- KV - key value

### Redis
- Remote Dictionary Server
- Re
- Redis

#### Note
- redis is used for caching
- db, publisher-subscriber, message

#### pros and cons
- memory 
- stale data ( stale means old ) => need to put an expiration date to clear that data from redis database.


####
- CRUD

#### Data types
- STRING
- LIST ( ARRAY)
- SET
- SORTED SET
- HASH

##### STRING

- SET
- GET

EXPIRY

- SETEX => set expiry time
- MSET => set multiple
- MGET => get multiple

#### LISTS
- lika a array of strings
- it does not use array, but instead use linked list ( Redis internally stores this as a Linked list )
- push into the left or right ( head or tail )

- LPUSH
- RPUSH

#### SET

- unique elements
- like new Set() => in JS
- we can jst add using sets

- SADD => set add
- SISMEMBER
- SMEMBERS
- SCARD
- SDIFF
- SUNION
- SREM
- SPOP
- SMOVE

#### HASHMAP

-  storing different key value pairs in a datastructure
- HMSET
- HGETALL
- HEXISTS
- HDEL

` Read some data from github
    some of this data does not change
    github has a rate limit on their system
    so if we cross 5k, 15k requests per minute, we get blocked
    
