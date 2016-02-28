FROM ambakshi/amazon-linux
MAINTAINER John Wells

# Install NPM and Node
RUN yum install -y epel-release
RUN sed -i -e 's/^#baseurl/baseurl/g' -e 's/^mirrorlist/#mirrorlist/g' /etc/yum.repos.d/epel*
RUN yum install -y nodejs npm --enablerepo=epel

# AWS SDK
RUN npm i -g npm aws-sdk@2.2.32


# Install git and pull the latest Redux.
RUN yum install -y git
RUN mkdir /opt/redux && cd /opt/redux
RUN git clone https://github.com/madmod/redux .
RUN npm install

CMD ["/usr/bin/node", "/opt/redex/redex.js"]

