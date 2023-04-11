FROM alpine
LABEL maintaner="Krotov Artem <timmson666@mail.ru>"

ENV TZ=Europe/Moscow
RUN apk add --update tzdata nodejs npm && cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && apk del tzdata

COPY src/ .

RUN npm i

CMD ["npm", "start"]
