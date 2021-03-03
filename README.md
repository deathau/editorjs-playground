I'm just playing around with EditorJS to see what I can do with it.

Currently I have a custom paragraph block which allows you to select from a list of tags

To test it out, clone the repo, run `npm install` then `npm run build` and finally open `index.html` in your browser of choice.

You'll be presented with a white box to type in, pressing enter adds more blocks. Each block has an options button in the top right with one of three tags. You can select one or more of them and they will apply to the block

The output json is saved on edit to the `pre` element on the right, so you can see what would be output.
