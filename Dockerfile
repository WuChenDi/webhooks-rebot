# node镜像
FROM node:14.18.0-alpine

# 配置时区
RUN apk update && apk add bash tzdata \
  && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 设置时区为中国东八区，这里的配置可以被docker-compose.yml或docker run时指定的时区覆盖
ENV TZ="Asia/Shanghai"

# 这个是容器中的文件目录
RUN mkdir -p /usr/src/app

# 设置工作目录
WORKDIR /usr/src/app

# 拷贝package.json文件到工作目录
COPY package.json /usr/src/app/package.json

# 安装npm依赖(使用淘宝的镜像源)
# 如果使用的境外服务器，无需使用淘宝的镜像源，即改为`RUN npm i`。
RUN npm install --production

# 拷贝所有源代码到工作目
COPY . /usr/src/app
# 暴露容器端口
EXPOSE 7001
CMD npm run tsc && npm start
