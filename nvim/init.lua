-- Packages
local gh = function (x)
    return 'https://github.com/' .. x
end

vim.pack.add({
    { src = gh('mason-org/mason.nvim') },
    { src = gh('neovim/nvim-lspconfig') },
    { src = gh('nvim-tree/nvim-tree.lua') },
    { src = gh('nvim-lualine/lualine.nvim') },
    { src = gh('nvim-tree/nvim-web-devicons') },
    { src = gh('mason-org/mason-lspconfig.nvim') },
    { src = gh('catppuccin/nvim'), name = 'catppuccin' },
    { src = gh('saghen/blink.cmp'), version = vim.version.range('*') },
    { src = gh('nvim-treesitter/nvim-treesitter'), version = 'master' },
    { src = gh('akinsho/bufferline.nvim'), version = vim.version.range('*') },
})

-- Options
vim.opt.wrap = false
vim.opt.list = true
vim.opt.number = true
vim.opt.swapfile = false
vim.opt.expandtab = true
vim.opt.winborder = 'rounded'
vim.opt.clipboard = 'unnamedplus'
vim.opt.fillchars = { eob = ' ' }
vim.opt.updatetime = 500
vim.opt.mousescroll = 'ver:1,hor:1'
vim.opt.relativenumber = true

-- LSP
vim.lsp.config('lua_ls', {
    settings = {
        Lua = { workspace = { library = vim.api.nvim_get_runtime_file('', true) } }
    }
})

-- Keymaps
vim.keymap.set('n', '<a-,>', ':bp<cr>', { silent = true })
vim.keymap.set('n', '<a-.>', ':bn<cr>', { silent = true })
vim.keymap.set('n', '<a-q>', ':bp|sp|bn|bd<cr>', { silent = true })
for _, x in ipairs({'h', 'j', 'k', 'l'}) do
    vim.keymap.set('n', '<a-' .. x .. '>', '<c-w>' .. x)
end

-- Auto-pairing
local brackets = { '()', '[]', '{}', "''", '""' }

local is_bracket = function ()
    local col = vim.api.nvim_win_get_cursor(0)[2]
    local line = vim.api.nvim_get_current_line()
    for _, x in ipairs(brackets) do
        if x == line:sub(col, col+1) then
            return true
        end
    end
    return false
end

local bracket_keymap = function (key, out)
    vim.keymap.set('i', key, function ()
        return is_bracket() and out or key
    end, { expr = true })
end

bracket_keymap('<bs>', '<right><bs><bs>')
bracket_keymap('<cr>', '<cr><esc>ko')
for _, x in ipairs(brackets) do
    vim.keymap.set('i', x:sub(1, 1), x .. '<left>')
end

-- Diagnostics
vim.diagnostic.config({
    signs = {
        text = {
            [vim.diagnostic.severity.ERROR] = '',
            [vim.diagnostic.severity.WARN] = '',
            [vim.diagnostic.severity.INFO] = '',
            [vim.diagnostic.severity.HINT] = '',
        }
    }
})

vim.api.nvim_create_autocmd('CursorHold', {
    callback = function ()
        vim.diagnostic.open_float({
            scope = 'cursor',
            focusable = false,
        })
    end
})

-- Indentation
local set_indentation = function (size)
    vim.opt.tabstop = size
    vim.opt.shiftwidth = size
    vim.opt.listchars = {
        trail = '·',
        leadmultispace = '▏' .. string.rep(' ', size - 1),
    }
end

set_indentation(4)

vim.api.nvim_create_autocmd('FileType', {
    pattern = { 'css', 'html', 'javascript', 'markdown', 'qml', 'svelte', 'typescript', 'tex' },
    callback = function () set_indentation(2) end
})

-- nvim-tree
vim.api.nvim_create_autocmd('VimEnter', {
    callback = function ()
        require('nvim-tree.api').tree.open()
    end
})

vim.api.nvim_create_autocmd({'BufEnter', 'QuitPre'}, {
    nested = false,
    callback = function(e)
        local tree = require('nvim-tree.api').tree

        -- Nothing to do if tree is not opened
        if not tree.is_visible() then
            return
        end

        -- How many focusable windows do we have? (excluding e.g. incline status window)
        local winCount = 0
        for _,winId in ipairs(vim.api.nvim_list_wins()) do
            if vim.api.nvim_win_get_config(winId).focusable then
                winCount = winCount + 1
            end
        end

        -- We want to quit and only one window besides tree is left
        if e.event == 'QuitPre' and winCount == 2 then
            vim.api.nvim_cmd({cmd = 'qall'}, {})
        end

        -- :bd was probably issued an only tree window is left
        -- Behave as if tree was closed (see `:h :bd`)
        if e.event == 'BufEnter' and winCount == 1 then
            -- Required to avoid "Vim:E444: Cannot close last window"
            vim.defer_fn(function()
                -- close nvim-tree: will go to the last buffer used before closing
                tree.toggle({find_file = true, focus = true})
                -- re-open nivm-tree
                tree.toggle({find_file = true, focus = false})
            end, 10)
        end
    end
})

-- Setups
require('mason').setup()
require('lualine').setup()
require('nvim-tree').setup()
require('mason-lspconfig').setup()

require('blink.cmp').setup({
    keymap = { preset = 'enter' },
    signature = { enabled = true },
})

require('catppuccin').setup({
    transparent_background = true,
    float = { transparent = true },
    custom_highlights = function (colors)
        return { LineNr = { fg = colors.overlay1 } }
    end,
})

require('bufferline').setup({
    highlights = require('catppuccin.special.bufferline').get_theme(),
    options = {
        indicator = { style = 'underline' },
        diagnostics = 'nvim_lsp',
        diagnostics_indicator = function(count, level, _, _)
            local icon = level:match('error') and ' ' or ' '
            return ' ' .. icon .. count
        end,
        offsets = {{
            filetype = 'NvimTree',
            text = 'File Explorer',
        }},
    },
})

require('nvim-treesitter.configs').setup({
    highlight = { enable = true }
})

vim.cmd.colorscheme('catppuccin')

