# CallCenterAgentApp
AngularJs Call Center front end Application 

#### issues with 'grunt server' on fedora 21 x86 kernel 3.19
######Grunt watch error - Waiting…Fatal error: watch ENOSPC
[slution depend on ](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc#comment27375118_17437601)
sudo echo 'fs.inotify.max_user_watches=524288' >> /etc/sysctl.d/99-sysctl.conf 
sudo sysctl --system
