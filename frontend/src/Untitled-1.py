# Step 1: Install the py-enigma library
# pip install py-enigma

from enigma.machine import EnigmaMachine

# Step 2: Configure the Enigma machine
machine = EnigmaMachine.from_key_sheet(
    rotors='VI I III',
    reflector='B',
    ring_settings='A Q L',
    plugboard_settings='BQ CR DI EJ KW MT OS PX UZ GH'
)

# Step 3: Set the initial rotor positions
machine.set_display('AQL')

# Step 4: Decrypt the ciphertext
ciphertext = "rkenr wozec gtrfl obbur bfgma fkgyq ctkvq zeucz hlvwx yyzat zbvns kgyyd sthmi vsifc ovexl zzdqv slyir nwqoj igxuu kdqgr fdbbd njppc mujyy wwcoy"
plaintext = machine.process_text(ciphertext.replace(" ", ""))

print("Decrypted message:", plaintext)