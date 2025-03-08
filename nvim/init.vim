" vim-plug
call plug#begin()
Plug 'nvim-tree/nvim-tree.lua'
Plug 'nvim-lualine/lualine.nvim'
Plug 'akinsho/bufferline.nvim', { 'tag': '*' }
Plug 'nvim-tree/nvim-web-devicons'
Plug 'catppuccin/nvim', {'as': 'catppuccin'}
Plug 'neoclide/coc.nvim', {'branch': 'release'}
Plug 'nvim-treesitter/nvim-treesitter', {'do': ':TSUpdate'}
Plug 'lukas-reineke/indent-blankline.nvim'
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

" Auto-closing brackets
let s:brackets = ['""', "''", "()", "[]", "{}"]

for pair in s:brackets
    execute "inoremap " . pair[0] . " " . pair . "<left>"
endfor

inoremap {<CR> {<CR>}<ESC>O

" Switch between windows
map <silent><A-Tab> <ESC><C-w>w

" Managing buffers
map <silent><A-left> :bp<CR>
map <silent><A-right> :bn<CR>
map <silent><A-q> :bp\|sp\|bn\|bd<CR>
"":bp\|bd#<CR>

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

" F5 to compile & run
autocmd FileType c,asm nnoremap <F5> :!clear && gcc -o %:r % && %:r<CR>
autocmd FileType cpp nnoremap <F5> :!clear && g++ -o %:r % && %:r<CR>
autocmd FileType python nnoremap <F5> :!clear && python3 %<CR>
autocmd FileType tex nnoremap <F5> :silent !xelatex %<CR>

" Maps and unmaps for non-programming languages
autocmd FileType html iunmap '
autocmd FileType tex iunmap '
autocmd FileType tex iunmap {<CR>
autocmd FileType tex inoremap " ``"<left>
autocmd FileType tex inoremap $ $$<left>

" 2-space tab for frontend development
autocmd FileType html,css,javascript set tabstop=2
autocmd FileType html,css,javascript set shiftwidth=2

luafile ~/.config/nvim/config.lua

