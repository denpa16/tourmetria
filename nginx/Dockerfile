FROM nginx:1.21-alpine
EXPOSE 80/tcp
EXPOSE 443/tcp
ENV ENVIRONMENT development
ENV TLS_MODE off
ENV SITE_HOST localhost
RUN apk add --no-cache esh curl openssl
RUN curl https://get.acme.sh | sh
RUN ln -s  /root/.acme.sh/acme.sh  /usr/local/bin/acme.sh
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf.esh ssl_params backend frontend exporters.conf /etc/nginx/
CMD ["/bin/sh", "-c", "echo $HTPASSWD >/etc/nginx/.htpasswd && echo $MONITORING_HTPASSWD >/etc/nginx/monitoring_htpasswd && esh -o /etc/nginx/conf.d/nginx.conf /etc/nginx/nginx.conf.esh && exec nginx -g 'daemon off;'"]
