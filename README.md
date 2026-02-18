# 🏋️ GymPro - App de Academia para Personal Trainers e Alunos

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.72-61dafb)
![Expo](https://img.shields.io/badge/Expo-~54.0.0-black)

## 📱 Sobre o Projeto

O **GymPro** é um SaaS completo para academias, desenvolvido em React Native com Expo. Ele conecta **Personal Trainers** e **Alunos** em uma única plataforma, permitindo a criação, gestão e execução de treinos personalizados.

### 👥 Dois Perfis de Usuário

| Perfil | Funcionalidades |
|--------|-----------------|
| **👨‍🏫 Personal Trainer** | • Cadastrar alunos<br>• Criar treinos personalizados<br>• Definir dias da semana, exercícios, séries e repetições<br>• Visualizar progresso dos alunos<br>• Acompanhar alunos sem treino |
| **🧑‍🎓 Aluno** | • Ver treino do dia<br>• Visualizar treinos da semana<br>• Registrar carga dos exercícios<br>• Marcar exercícios como concluídos<br>• Ver progresso em tempo real |

---

## ✨ Funcionalidades Principais

- ✅ **Autenticação real** com persistência (AsyncStorage)
- ✅ **Relacionamento personal-aluno** (cada aluno vinculado a um personal)
- ✅ **Criação de treinos** com múltiplos exercícios
- ✅ **Registro de carga** por exercício
- ✅ **Progresso visual** com barras de porcentagem
- ✅ **Modo escuro** global
- ✅ **Upload de foto de perfil** com persistência
- ✅ **Navegação condicional** (aluno vs personal)
- ✅ **Validações completas** em todos os formulários
- ✅ **Design profissional** com Material Icons

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Para quê? |
|------------|--------|-----------|
| React Native | 0.72 | Framework principal para iOS/Android |
| Expo | ~54.0 | Desenvolvimento rápido e testes |
| TypeScript | ~5.9 | Tipagem estática e código mais seguro |
| React Navigation | 7.x | Navegação entre telas |
| AsyncStorage | 2.2.0 | Persistência de dados local |
| Expo Image Picker | 17.0.10 | Upload de foto de perfil |
| Material Icons | 10.3 | Ícones profissionais |

---

## 📂 Estrutura do Projeto
```bash
GymApp/
├── src/
│ ├── contexts/ # Contextos globais (Auth, Theme)
│ ├── navigation/ # Configuração de navegação
│ ├── screens/ # Todas as telas do app
│ ├── services/ # Serviços e APIs (AsyncStorage)
│ └── utils/ # Utilitários e constantes
├── assets/ # Imagens e fontes
├── App.tsx # Entrada da aplicação
├── app.json # Configuração do Expo
└── package.json # Dependências

text
```
---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (v18+)
- Expo CLI
- iOS Simulator (macOS) ou Android Emulator
- Expo Go no celular (para testes físicos)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/DiegoCarvalho-dev/SaasAcademia.git

# 2. Entre na pasta
cd gymapp

# 3. Instale as dependências
npm install

# 4. Execute o projeto (modo LAN - celular na mesma rede)
npx expo start

# 5. Escaneie o QR Code com o Expo Go
```
## 🔐 Fluxo de Autenticação

```bash
Cadastro: Usuário escolhe entre "Aluno" ou "Personal Trainer"

Aluno: Deve selecionar um personal da lista

Login: Credenciais validadas no AsyncStorage

Dashboard: Renderizado conforme o tipo de usuário
```
## 📊 Exemplos de Uso
### 👨‍🏫 Personal Trainer

1. Faz login → Vê dashboard com métricas
2. Clica em "Criar treino" para um aluno
3. Preenche: nome do treino, dia da semana, duração
4. Adiciona exercícios com séries, repetições e descanso
5. Treino salvo e visível para o aluno

### 🧑‍🎓 Aluno

1. Faz login → Vê dashboard com progresso
2. Acessa aba "Treinos" → Lista de treinos da semana
3. Clica em um treino → Vê detalhes dos exercícios
4. Registra carga e marca como concluído
5. Progresso atualiza em tempo real

## 🧪 Testes Realizados
✅ Cadastro de personal e aluno

✅ Login com persistência

✅ Criação de treinos com validação de dias

✅ Registro de carga e conclusão de exercícios

✅ Modo escuro e persistência de foto

✅ Navegação condicional

## 🎯 Próximos Passos (Futuras Melhorias)
🔜 Integração com backend real (Firebase)

🔜 Notificações push

🔜 Gráficos de evolução

🔜 Compartilhamento de treinos

🔜 Versão web com React Native Web


## 👨‍💻 Autor

**Diego Ricardo Carvalho**
