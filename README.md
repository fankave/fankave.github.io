mobile-redirect
===============

Simple nginx server which redirects based on mobile device

install
----
```shell
docker build -t mobile-redirect .
```
```shell
docker run -d -p 80:80 -v $PWD/website:/var/www/html/website mobile-redirect nginx
```
