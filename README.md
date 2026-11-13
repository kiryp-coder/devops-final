# devops-final

Итоговый проект по DevOps: Node.js-приложение с метриками, мониторинг (Prometheus + Grafana), CI/CD на GitHub Actions и развёртывание через Ansible.

[![CI/CD](https://github.com/kiryp-coder/devops-final/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/kiryp-coder/devops-final/actions/workflows/ci-cd.yml)

## Маршруты

| Метод | Путь | Ответ |
|---|---|---|
| GET | `/` | `DevOps Final Project` |
| GET | `/health` | `{ "status": "ok" }` |
| GET | `/metrics` | метрики Prometheus (`prom-client`: стандартные метрики процесса + `http_requests_total`) |

## Запуск стека

```bash
docker compose up -d --build
```

| Сервис | Адрес |
|---|---|
| Приложение | http://localhost:3000 |
| Prometheus | http://localhost:9090 (Status → Targets: `app` — UP) |
| Grafana | http://localhost:3001 (admin / admin), источник Prometheus и дашборд подключаются автоматически |

## Разработка

```bash
npm ci
npm start
npm run lint
npm test
```

## CI/CD (`.github/workflows/ci-cd.yml`)

```
lint ──► test (+ PostgreSQL) ──► build-and-push (только push в main) ──► ghcr.io/kiryp-coder/devops-final: latest + <sha>
```

`main` защищена: слияние только через pull request после успешных `lint` и `test`.

## Развёртывание через Ansible

Плейбук `ansible/deploy.yml` на localhost: ставит Docker (если его нет), создаёт `/opt/devops-final`, копирует `docker-compose.yml`, `prometheus.yml`, настройки Grafana и выполняет `docker compose up -d`.

```bash
sudo apt install -y ansible
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml --ask-become-pass
```

Повторный запуск ничего не меняет (`changed=0`) — плейбук идемпотентен.

> Образ `app` берётся локально (после `docker compose build`) или из ghcr.io.
