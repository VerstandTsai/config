" vim-plug
call plug#begin()
Plug 'nvim-tree/nvim-tree.lua'
Plug 'nvim-lualine/lualine.nvim'
Plug 'akinsho/bufferline.nvim', {'tag': '*'}
Plug 'nvim-tree/nvim-web-devicons'
Plug 'catppuccin/nvim', {'as': 'catppuccin'}
Plug 'neoclide/coc.nvim', {'branch': 'release'}
Plug 'nvim-treesitter/nvim-treesitter', {'do': ':TSUpdate'}
Plug 'lukas-reineke/indent-blankline.nvim'
Plug '3rd/image.nvim', {'commit': '21909e3eb03bc738cce497f45602bf157b396672'}
call plug#end()

" Line numbers
set number

" Disable the tildes (~) at the beginning of blank lines
set fillchars=eob:\ 

" No line wrap
set nowrap

" 4-space tab
set tabstop=4
set shiftwidth=4

" Convert tab to spaces
set expandtab

set foldmethod=marker

" Highlight trailing spaces
match CurSearch /\s\+$/

" Auto-closing brackets
let s:brackets = ['""', "''", "()", "[]", "{}"]

for pair in s:brackets
    execute "inoremap " . pair[0] . " " . pair . "<left>"
endfor

inoremap {<CR> {<CR>}<ESC>O

" Remove pair of empty brackets
function! RemoveBracketPair()
    for pair in s:brackets
        if getline('.')[col('.')-2] == pair[0] && getline('.')[col('.')-1] == pair[1]
            return "\<right>\<bs>\<bs>"
        endif
    endfor
    return "\<bs>"
endfunction

inoremap <expr> <bs> RemoveBracketPair()

" Press enter to apply completion
inoremap <expr> <cr> coc#pum#visible() ? coc#pum#confirm() : "\<CR>"

" Switch between windows
nnoremap <silent><A-left> <ESC><C-w><left>
nnoremap <silent><A-right> <ESC><C-w><right>
nnoremap <silent><A-up> <ESC><C-w><up>
nnoremap <silent><A-down> <ESC><C-w><down>

" Managing buffers
nnoremap <silent><C-left> :bp<CR>
nnoremap <silent><C-right> :bn<CR>
nnoremap <silent><C-q> :bp\|sp\|bn\|bd<CR>

" F5 to compile & run
autocmd FileType c,asm nnoremap <F5> :!gcc -o %:r % && ./%:r<CR>
autocmd FileType cpp nnoremap <F5> :!g++ -o %:r % && ./%:r<CR>
autocmd FileType python nnoremap <F5> :!python3 %<CR>
autocmd FileType tex nnoremap <F5> :silent !lualatex %<CR>

" Maps and unmaps for non-programming languages
autocmd FileType html iunmap '
autocmd FileType tex iunmap '
autocmd FileType tex iunmap {<CR>
autocmd FileType tex inoremap " ``"<left>
autocmd FileType tex inoremap $ $$<left>

" 2-space tab for certain laguages
autocmd FileType html,css,javascript,typescript,typescriptreact,tex set tabstop=2
autocmd FileType html,css,javascript,typescript,typescriptreact,tex set shiftwidth=2

luafile ~/.config/nvim/config.lua

