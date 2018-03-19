describe('Editor State', function () {
  describe('Mode Change', function () {
    it('select <-> write mode');
  });

  describe('Select Mode', function () {
    it('select by left drag');
    it('deselect by right mousedown');
    it('exclusive select by ctrl + drag');
    it('remove selected Notes by delete/backspace key');
    it('move normal note');
    it('move normal notes');
  });

  describe('Write Mode', function () {
    it('create note by left mousedown');
    it('delete note by right mousedown');
    it('create long note by mouse drag');
    it('create short note by short mouse drag');
    it('short to long note by ctrl + mousemove');
    it('long to short note by ctrl + mousemove');
  });
});
