cd client/
npm run build
cd ../
git add .
git commit -m 'autocommit'
git push origin master
heroku psql --app stormy-tundra-28859