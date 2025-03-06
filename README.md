Отчёт по применению CI/CD в проекте

1. Описание проекта

Целью данного проекта является автоматизация процессов непрерывной интеграции и непрерывной доставки для приложения на React. Для этого была использована технология CI/CD, которая позволяет нам настроить автоматизированный и стабильный процесс сборки, тестирования и развёртывания приложения при помощи различных инструментов CI/CD. Мы настроили пайплайн, который строит, тестирует и развёртывает наш проект автоматически при каждом пуше в основную ветку или при открытии/слиянии пулл на основную ветку.



2. Цели CI/CD

CI/CD — это практика программной инженерии, которая позволяет нам создавать автоматизированные пайплайны интеграции, тестирования и развёртывания. Целями CI/CD являются:

Непрерывная интеграция (Continuous Integration): автоматическая сборка, выполнение тестов и выявление ошибок в коде на ранних стадиях.

Непрерывное развертывание (Continuous Deployment): автоматическое развёртывание приложения на сервер или в облако после успешного прохождения этапов тестирования и сборки.

В рамках проекта пайплайн CI/CD автоматически выполняет следующие этапы:

- Сборка приложения;

- Тестирование с использованием Jest;

- Развёртывание приложения на Vercel.



3. Использованные инструменты и технологии

GitHub Actions — для создания и управления пайплайном непрерывной интеграции и непрерывной доставки;

Node.js — для различных задач, таких как установка зависимостей и сборка;

Jest — для тестирования;

Vercel — для автоматического развёртывания приложения;



4. Описание пайплайна

GitHub Actions пайплайн настроен для выполнения задач при каждом пуше в ветку main или при отрытии пулл-реквеста на эту ветку. В рамках пайплайна определены шаги для стабильного и автоматизированного прогона тестов. 


name: CI/CD Pipeline for React App

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Run tests
        run: npm test

      - name: Deploy to Vercel
        run: |

Объяснение шагов:

- Checkout code — этот шаг клонирует репозиторий на виртуальную машину, где будет выполнена сборка.

- Set up Node.js - операция по установке Node.js нужной версии, необходимой для выполнения программ.

- Install dependencies - установка зависимостей, команда устанавливает все зависимости, указанные в файле package.json.

- Build project - сборка проекта, действие по сборке React-приложения за счет выполнения команды выполнения сборки NPM.

- Run tests - запуск тестов, команда для запуска тестов при проверке на Jest.

- Deploy to Vercel - публикация на Vercel, автоматизированное размещение программы на системе Vercel.



5. Скрины успешного выполнения pipeline

![image](https://github.com/user-attachments/assets/2afbd651-c716-4889-a099-a3f2051beb94)



6. Заключение

Итак, использование пайплайна CI/CD позволяет скорость разработки значительно увеличить, сделав ее более предсказуемой и обеспечивая автоматичный деплой. В этом проекте для организации данного процесса применен GitHub Actions, который позволяет интегрировать практически все составляющие процесса сборки и автоматизировать все процессы цепочки в одном месте, что упрощает управление проектом и сокращает количество ручного труда. 
