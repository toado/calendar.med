# calendar.med

[![codecov](https://codecov.io/gh/UAlberta-CMPUT401/learning-sciences/branch/master/graph/badge.svg?token=77014YMFC8)](https://codecov.io/gh/UAlberta-CMPUT401/learning-sciences)
![Build & Test Project](https://github.com/UAlberta-CMPUT401/learning-sciences/workflows/Build%20&%20Test%20Project/badge.svg?branch=master)

http://[2605:fd00:4:1001:f816:3eff:fe83:5737]/
![admin calendar view](https://puu.sh/H2Y8T/cb4c495c8e.png)

## Prerequisites 

* docker
* docker-compose
* mysql 5.7
* yarn

## Installation

1. Clone the repository
2. Create a local MySQL database
3. Copy and customize environment variables to match local database
    ```shell script
    $ cd learning-sciences/app
    $ cp .env.template .env
    ```
4. Run yarn install (if this is your first build or new packages are added)
    ```shell script
    $ cd learning-sciences/app/frontend
    $ yarn install
    ```
5. Run docker-compose
    ```shell script
    $ docker-compose up --build
    ```
6. Migrate & seed the database
    ```shell script
    $ docker-compose run backend python manage.py migrate
    $ docker-compose run backend python manage.py loaddata all-data
    ```
7. Navigate to `localhost:8000` in your browser. It should say 'The install worked successfully! Congratulations!'
8. Navigate to `localhost:3000` in your browser. You should see a React logo

## Testing

**Front-end React tests**

```shell script
$ docker-compose run frontend yarn test
```

**Back-end Django tests**

```shell script
$ docker-compose run backend python manage.py test
```

## Creating a Pull Request

**Make sure all the following pass without errors:** 

```shell script
$ docker-compose run frontend yarn test
$ docker-compose run backend python manage.py test
$ docker-compose run backend pycodestyle .
```
