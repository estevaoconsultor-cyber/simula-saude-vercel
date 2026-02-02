#!/bin/bash

# Criar o CSS com @font-face
ICONS_CSS='<link rel="stylesheet" href="/_expo/static/css/icons.css">'

# Adicionar o link do CSS em todos os arquivos HTML
for html_file in /home/ubuntu/health-plan-simulator/dist/**/*.html; do
  if [ -f "$html_file" ]; then
    # Verificar se já não tem o link
    if ! grep -q "icons.css" "$html_file"; then
      # Adicionar o link após a tag <head>
      sed -i 's/<head>/<head>\n'"$ICONS_CSS"'/' "$html_file"
    fi
  fi
done

echo "✅ CSS de ícones adicionado a todos os arquivos HTML"
