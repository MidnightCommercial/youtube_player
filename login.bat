
IF "%1"=="" (
	SET PORT=5555
) ELSE (
	SET PORT=%1
)

SET CLIENT_ID=4701549121.153002743047
SET CLIENT_SECRET=9f7e3b68fbb824c9b04f1b6e8431e26d
SET VERIFICATION_TOKEN=AmqqqxwkgvHuYJnSMYxfZ6S4

start node app.js

echo "wait 2 seconds..."
ping 192.0.2.2 -n 1 -w 2000 > nul

start lt --port %PORT% --subdomain player