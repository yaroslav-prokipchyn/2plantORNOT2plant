FROM python:3.10

ARG USER=dev
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN apt update -y && apt install -y sudo
RUN groupadd --gid $USER_GID $USER && \
    useradd --uid $USER_UID --gid $USER_GID -m $USER && \
    echo ${USER} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USER} && \
    chmod 0440 /etc/sudoers.d/${USER} && \
    chsh ${USER} -s /bin/bash

RUN mkdir -p /commandhistory
RUN chown -R ${USER} /commandhistory

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" && \
  echo $SNIPPET >> "/home/${USER}/.bashrc"

RUN apt update -y
RUN DEBIAN_FRONTEND=noninteractive apt install -y tzdata
RUN apt install -y \
    build-essential \
    cmake \
    curl \
    ghostscript \
    git \
    gmt \
    libgdal-dev \
    wkhtmltopdf

RUN wget https://github.com/GenericMappingTools/gmt/releases/download/6.4.0/gmt-6.4.0-src.tar.gz
RUN tar -xzf gmt-6.4.0-src.tar.gz && \
  cd gmt-6.4.0 && \
  mkdir build && \
  cd build && cmake .. && \
  make && \
  make install && \
  cd ../.. && \
  rm -rf gmt-6.4.0*


RUN mkdir -p /code/nave_analytics
RUN chown -R ${USER} /code
WORKDIR /code

USER ${USER}
ENV PATH "${PATH}:/home/${USER}/.local/bin"

WORKDIR /code/nave_analytics
RUN mkdir src && \
  touch src/__init__.py
COPY setup.cfg .
COPY setup.py .
COPY requirements.txt .
RUN pip install -U pip
RUN pip install -r requirements.txt

ADD . .

CMD ["gunicorn", "app:app", "-b", "0.0.0.0:8000"]
