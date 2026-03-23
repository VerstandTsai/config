vim.keymap.set('n', '<a-c>', ':silent !pandoc -f markdown+east_asian_line_breaks % -o %:r.html -s --mathjax -H ~/Templates/css/revealjs.html -t revealjs -i --highlight-style=breezedark<cr>')
