FROM quay.io/sampandey001/secktor
RUN git clone https://github.com/hakisolos/X-shaka /root/hakisolos
WORKDIR /root/hakisolos/
RUN npm install npm@latest
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
