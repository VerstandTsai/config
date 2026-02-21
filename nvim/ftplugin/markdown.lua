vim.keymap.set('n', '<a-c>', ':silent !pandoc -f markdown+east_asian_line_breaks % -o %:r.html -s --mathjax -c ~/Templates/css/markdown.css<cr>')
vim.keymap.set('n', '<a-C>', ':silent !pandoc -f markdown+east_asian_line_breaks % -o %:r.html -s --mathjax -c ~/Templates/css/revealjs.css -t revealjs<cr>')
