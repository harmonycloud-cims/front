FROM openshift/nginx:1.12
COPY build /usr/share/nginx/html

WORKDIR /usr/local/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]